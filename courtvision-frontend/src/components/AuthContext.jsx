import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { setupAxiosInterceptors, api, setupApiInterceptors } from "../utils/axiosConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);
  const [tokenRefreshTimeout, setTokenRefreshTimeout] = useState(null);
  // Use a ref to track initialization status
  const initialized = useRef(false);
  // Use a ref to avoid circular dependency
  const refreshTokenRef = useRef(null);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setUser(null);
    
    // Clear any existing refresh timeout
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout);
      setTokenRefreshTimeout(null);
    }
  }, [tokenRefreshTimeout]);

  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  // Setup axios interceptors
  useEffect(() => {
    setupAxiosInterceptors(logout);
    setupApiInterceptors(logout);
  }, [logout]);

  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      clearAuthData();
      return false;
    }
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Token expired
        clearAuthData();
        return false;
      }
      
      // Set token expiry for refresh scheduling
      setTokenExpiryTime(decoded.exp);
      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      clearAuthData();
      return false;
    }
  }, [clearAuthData]);
  
  // Schedule token refresh 5 minutes before expiry
  const scheduleTokenRefresh = useCallback((expiryTime) => {
    if (!expiryTime) return;
    
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = expiryTime - currentTime;
    
    // If token expires in less than 5 minutes, don't schedule refresh
    if (timeUntilExpiry < 300) return;
    
    // Schedule refresh 5 minutes before expiry
    const refreshTime = (timeUntilExpiry - 300) * 1000;
    
    const timeout = setTimeout(() => {
      // Use the refreshTokenRef to avoid circular dependency
      if (refreshTokenRef.current) {
        refreshTokenRef.current();
      }
    }, refreshTime);
    
    setTokenRefreshTimeout(timeout);
    
    return timeout;
  }, []);
  
  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.post("/auth/refresh", { token });
      
      if (response.data.token) {
        const { token } = response.data;
        const decoded = jwtDecode(token);
        
        localStorage.setItem("authToken", token);
        setTokenExpiryTime(decoded.exp);
        
        // Schedule next refresh
        scheduleTokenRefresh(decoded.exp);
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearAuthData();
    }
  }, [clearAuthData, scheduleTokenRefresh]);

  // Store refreshToken in ref to avoid circular dependency
  refreshTokenRef.current = refreshToken;

  // Check authentication on mount and handle persistence
  useEffect(() => {
    const initAuth = () => {
      if (initialized.current) return;
      initialized.current = true;
      
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");

      if (token && checkTokenValidity()) {
        setUser({ id: userId, role });
        
        // Schedule token refresh if needed
        if (tokenExpiryTime) {
          scheduleTokenRefresh(tokenExpiryTime);
        }
      } else {
        clearAuthData();
      }
      setLoading(false);
    };

    initAuth();
    
    // Listen for storage events (e.g. logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "authToken" && !e.newValue) {
        clearAuthData();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
      }
    };
  }, [checkTokenValidity, clearAuthData, scheduleTokenRefresh, tokenExpiryTime, tokenRefreshTimeout]);

  const login = useCallback((token, role, userId) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", userId);
    
    const decoded = jwtDecode(token);
    setTokenExpiryTime(decoded.exp);
    scheduleTokenRefresh(decoded.exp);
    
    setUser({ id: userId, role });
  }, [scheduleTokenRefresh]);

  // Check if route is accessible based on user role
  const isAuthorized = useCallback((requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  }, [user]);

  // Force refresh authentication state - useful for troubleshooting
  const refreshAuthState = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (token && checkTokenValidity()) {
      setUser({ id: userId, role });
    } else {
      clearAuthData();
    }
  }, [checkTokenValidity, clearAuthData]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthorized, 
      checkTokenValidity,
      refreshToken,
      refreshAuthState
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
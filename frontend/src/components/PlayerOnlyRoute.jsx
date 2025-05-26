import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "./LoadingSpinner";

function PlayerOnlyRoute() {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const { user, loading, checkTokenValidity } = useAuth();
  const location = useLocation();

  // Re-verify when location changes
  useEffect(() => {
    const verifyAuth = async () => {
      // First check if token is valid
      const isTokenValid = checkTokenValidity();
      console.log("PlayerOnlyRoute - Token valid:", isTokenValid);
      console.log("PlayerOnlyRoute - User:", user);

      // Check roles in localStorage directly as a fallback
      const lsRole = localStorage.getItem("userRole");
      console.log("Role in localStorage:", lsRole);

      // Check if user has player role - case insensitive
      const hasPlayerRole = 
        (isTokenValid && user && 
         (user.role?.toLowerCase() === "player" || lsRole?.toLowerCase() === "player"));
      
      if (hasPlayerRole) {
        console.log("PlayerOnlyRoute - User IS authorized as player");
        setIsAuthorized(true);
      } else {
        console.log("PlayerOnlyRoute - User is NOT authorized as player:");
        console.log("- Token valid:", isTokenValid);
        console.log("- User present:", !!user);
        console.log("- User role:", user?.role);
        console.log("- localStorage role:", lsRole);
        setIsAuthorized(false);
      }
    };

    // Only check auth if not still loading
    if (!loading) {
      verifyAuth();
    }
  }, [checkTokenValidity, user, location.pathname, loading]);

  // Show loading while checking auth
  if (loading || isAuthorized === null) {
    return <LoadingSpinner />;
  }

  // Render Outlet for authorized users, else redirect to login
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

export default PlayerOnlyRoute;

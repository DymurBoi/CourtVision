import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "./LoadingSpinner";

function AdminOnlyRoute() {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const { user, loading, checkTokenValidity } = useAuth();
  const location = useLocation();

  // Re-verify when location changes
  useEffect(() => {
    const verifyAuth = async () => {
      // First check if token is valid
      const isTokenValid = checkTokenValidity();
      
      // If user exists, check for admin role
      const lsRole = localStorage.getItem("userRole");
      
      // Check if user has admin role - case insensitive
      const hasAdminRole = 
        (isTokenValid && user && (user.role?.toLowerCase() === "admin" || lsRole?.toLowerCase() === "admin"));
      
      if (hasAdminRole) {
        console.log("AdminOnlyRoute - User IS authorized as admin");
        setIsAuthorized(true);
      } else {
        console.log("AdminOnlyRoute - User is NOT authorized as admin");
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
  return isAuthorized ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location }} />;
}

export default AdminOnlyRoute;

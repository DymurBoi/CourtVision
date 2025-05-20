import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "./LoadingSpinner";

function CoachOnlyRoute() {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const { user, loading, checkTokenValidity } = useAuth();
  const location = useLocation();
  
  // Re-verify when location changes
  useEffect(() => {
    const verifyAuth = async () => {
      // First check if token is valid
      const isTokenValid = checkTokenValidity();
      console.log("CoachOnlyRoute - Token valid:", isTokenValid);
      console.log("CoachOnlyRoute - User:", user);
      
      // Check roles in localStorage directly as a fallback
      const lsRole = localStorage.getItem("userRole");
      console.log("Role in localStorage:", lsRole);
      
      // Check if user has coach role - case insensitive
      const hasCoachRole = 
        (isTokenValid && user && 
         (user.role?.toLowerCase() === "coach" || lsRole?.toLowerCase() === "coach"));
      
      if (hasCoachRole) {
        console.log("CoachOnlyRoute - User IS authorized as coach");
        setIsAuthorized(true);
      } else {
        console.log("CoachOnlyRoute - User is NOT authorized as coach:");
        console.log("- Token valid:", isTokenValid);
        console.log("- User present:", !!user);
        console.log("- User role:", user?.role);
        console.log("- localStorage role:", lsRole);
        setIsAuthorized(false);
      }
    };
    
    verifyAuth();
  }, [checkTokenValidity, user, location.pathname]);

  // Show loading while checking auth
  if (loading || isAuthorized === null) {
    return <LoadingSpinner />;
  }
  
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

export default CoachOnlyRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import LoadingSpinner from "./LoadingSpinner"

function PlayerOnlyRoute() {
  const [isAuthorized, setIsAuthorized] = useState(null)
  const { user, loading, checkTokenValidity } = useAuth()
  const location = useLocation()
  
  // Re-verify when location changes
  useEffect(() => {
    const verifyAuth = async () => {
      // First check if token is valid
      const isTokenValid = checkTokenValidity()
      
      // Then check if user has player role
      if (isTokenValid && user && user.role === "player") {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    }
    
    verifyAuth()
  }, [checkTokenValidity, user, location.pathname])

  // Show loading while checking auth
  if (loading || isAuthorized === null) {
    return <LoadingSpinner />
  }
  
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export default PlayerOnlyRoute

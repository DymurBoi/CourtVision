"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import "../styles/Login.css"
import basketballCourt from "../assets/BasketballCourt.jpg"
import { api } from "../utils/axiosConfig"
import { useAuth } from "../components/AuthContext"
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"


function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("player")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showPassword, setShowPassword] = useState(false)
  const { login, user } = useAuth()
  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "player") {
        navigate("/player/home", { replace: true });
      } else if (user.role === "coach") {
        navigate("/coach/home", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log(`Attempting login as ${role} with email: ${email}`);
      const response = await api.post(`/auth/login/${role}`, { email, password })

      console.log("Login API response status:", response.status);
      console.log("Login API response data:", response.data);
      
      const { token } = response.data
      const decoded = jwtDecode(token)
      
      console.log("*** LOGIN DEBUG INFO ***");
      console.log("Raw token received:", token);
      console.log("Token decoded contents:", decoded);
      console.log("Token subject:", decoded.sub);
      console.log("Token role:", decoded.role);
      console.log("Role type:", typeof decoded.role);
      console.log("Token expiry:", new Date(decoded.exp * 1000).toLocaleString());
      
      // Extract the correct ID based on the JWT format
      const userId = decoded.sub;
      
      // Store the normalized role (guarantee lowercase without ROLE_ prefix)
      let userRole = decoded.role;
      console.log("Original role from token:", userRole);
      
      // Convert to string and lowercase if not already
      if (typeof userRole === 'string') {
        userRole = userRole.toLowerCase();
      } else if (userRole) {
        userRole = String(userRole).toLowerCase();
      } else {
        // Fallback to the selected role if token doesn't have one
        userRole = role.toLowerCase();
        console.warn("No role found in token, using selected role:", userRole);
      }
      
      // Remove ROLE_ prefix if present
      if (userRole.startsWith("role_")) {
        userRole = userRole.substring(5); // "role_player" -> "player"
      }
      
      console.log("Final normalized role:", userRole);
      console.log(`Login successful as ${userRole}`);
      console.log(`User ID being stored: ${userId}`);
      
      // Explicitly store values in localStorage for debugging
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", userRole);
      
      console.log("Stored in localStorage:");
      console.log("- authToken:", localStorage.getItem("authToken") ? "Present (length: " + localStorage.getItem("authToken").length + ")" : "Missing");
      console.log("- userId:", localStorage.getItem("userId"));
      console.log("- userRole:", localStorage.getItem("userRole"));

      // Use the auth context to log in with the token role
      login(token, userRole, userId)

      // Get redirect path from location state or use default
      const from = location.state?.from?.pathname || 
                  (userRole === "player" ? "/player/home" : 
                   userRole === "coach" ? "/coach/home" : "/");
                   
      // Redirect based on role with replace to prevent back navigation to login
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login failed:", error)
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        setError(error.response.data || "Invalid email or password. Please try again.")
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please try again.")
      } else {
        console.error("Error setting up request:", error.message);
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Add these styles at the end of the component
  const roleButtonStyles = `
    .role-button-group {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    
    .role-button {
      flex: 1;
      padding: 0.8rem;
      border: 1px solid rgba(123, 123, 243, 0.3);
      border-radius: 4px;
      background-color: white;
      color: var(--dark-blue);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .role-button.active {
      background: linear-gradient(to right, var(--medium-purple), var(--bright-purple));
      color: white;
      border-color: transparent;
    }
    
    .role-button:hover:not(.active) {
      border-color: var(--medium-purple);
      background-color: var(--light-purple);
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 10px;
      text-align: center;
    }
  `

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={basketballCourt || "/placeholder.svg"} alt="Basketball Court" />
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-logo">
            <h1>CourtVision</h1>
          </div>

          <h2 className="auth-title">Sign In</h2>
          <p className="auth-subtitle">Welcome back! Please enter your details.</p>

          <form className="auth-form" onSubmit={handleLogin}>
            {/* Role selector buttons */}
            <div className="form-group role-buttons">
              <label>Login as:</label>
              <div className="role-button-group">
                <button
                  type="button"
                  className={`role-button ${role === "player" ? "active" : ""}`}
                  onClick={() => setRole("player")}
                >
                  Player
                </button>
                <button
                  type="button"
                  className={`role-button ${role === "coach" ? "active" : ""}`}
                  onClick={() => setRole("coach")}
                >
                  Coach
                </button>
              </div>
            </div>

            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined" required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ bgcolor: "#F5F5F5", width: 440 }}
                />
              </FormControl>

            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined" required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ bgcolor: "#F5F5F5", width: 440 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>

          </div>
        </div>
        <style jsx>{roleButtonStyles}</style>
        <style jsx>{`
          .admin-link {
            margin-top: 10px;
            font-size: 0.9em;
          }
          
          .admin-link a {
            color: var(--medium-purple);
          }
        `}</style>
      </div>
    </div>
  )
}

export default Login

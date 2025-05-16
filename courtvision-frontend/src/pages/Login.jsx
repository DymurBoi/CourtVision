"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import "../styles/Login.css"
import basketballCourt from "../assets/BasketballCourt.jpg"
import { api } from "../utils/axiosConfig"
import { useAuth } from "../components/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("player")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()
  
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
      const response = await api.post(`/auth/login/${role}`, { email, password })

      const { token } = response.data
      const decoded = jwtDecode(token)
      console.log("Decoded token:", decoded)

      // Use the auth context to log in
      login(token, role, decoded.sub)

      // Get redirect path from location state or use default
      const from = location.state?.from?.pathname || 
                  (role === "player" ? "/player/home" : 
                   role === "coach" ? "/coach/home" : "/");
                   
      // Redirect based on role with replace to prevent back navigation to login
      navigate(from, { replace: true })
    } catch (error) {
      console.error("Login failed:", error)
      setError("Invalid email or password. Please try again.")
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

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
            <p className="admin-link">
              <Link to="/admin/login">Administrator Login</Link>
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

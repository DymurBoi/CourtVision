"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import "../styles/Login.css"
import basketballCourt from "../assets/BasketballCourt.jpg"
import axios from "axios"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("player") // default to player
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`http://localhost:8080/api/auth/login/${role}`, { email, password })

      const { token } = response.data
      localStorage.setItem("authToken", token)

      const decoded = jwtDecode(token)
      console.log("Decoded token:", decoded)

      localStorage.setItem("userId", decoded.sub)
      localStorage.setItem("userRole", role)

      alert("Login successful!")
      onLogin && onLogin(decoded.sub)

      navigate("/") // Change if you have role-based redirects
    } catch (error) {
      console.error("Login failed:", error)
      alert("Invalid email or password. Please try again.")
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

            <button type="submit" className="auth-button">
              Login
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
        <style jsx>{roleButtonStyles}</style>
      </div>
    </div>
  )
}

export default Login

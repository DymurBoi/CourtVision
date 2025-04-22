"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Login.css"
import basketballCourt from "../assets/BasketballCourt.jpg"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would authenticate the user
    console.log("Login attempt with:", email, password)
    // Redirect to home page after "login"
    navigate("/")
  }

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

          <form className="auth-form" onSubmit={handleSubmit}>
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
              Are you a player? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


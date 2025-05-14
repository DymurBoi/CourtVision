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
      let response = null
      if (role==="player"){
        response = await axios.post(
        `http://localhost:8080/api/auth/login/player`,
        { email, password }
      )
      }
      else{
         response = await axios.post(
        `http://localhost:8080/api/auth/login/coach`,
        { email, password }
      )
      }
 
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
            {/* 🔘 Role selector */}
<div className="form-group">
<label>Login as:</label>
<select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="auth-select"
>
<option value="player">Player</option>
<option value="coach">Coach</option>
</select>
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
              Don’t have an account? <Link to="/register">Register here</Link>
</p>
</div>
</div>
</div>
</div>
  )
}
 
export default Login
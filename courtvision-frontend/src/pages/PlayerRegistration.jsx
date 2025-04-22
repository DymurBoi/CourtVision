"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Login.css"
import basketballCourt from "../assets/BasketballCourt.jpg"

function PlayerRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would register the user
    console.log("Registration data:", formData)
    // Redirect to login page after "registration"
    navigate("/login")
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

          <h2 className="auth-title">Player Registration</h2>
          <p className="auth-subtitle">Join CourtVision as a player</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Birth Date</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Register
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerRegistration


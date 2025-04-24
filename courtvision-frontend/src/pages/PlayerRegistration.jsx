import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/Login.css"
import basketballCourt from "../assets/BasketballCourt.jpg"
 
function PlayerRegistration() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    birthDate: ""
  })
 
  const navigate = useNavigate()
 
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
 
    try {
      const response = await axios.post("http://localhost:8080/api/players/post", formData)
 
      console.log("Registration successful:", response.data)
      alert("Registration successful! Please log in.")
      navigate("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
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
 
          <h2 className="auth-title">Player Registration</h2>
<p className="auth-subtitle">Join CourtVision as a player</p>
 
          <form className="auth-form" onSubmit={handleSubmit}>
<div className="form-row">
<div className="form-group">
<label htmlFor="fname">First Name</label>
<input
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                />
</div>
 
              <div className="form-group">
<label htmlFor="lname">Last Name</label>
<input
                  type="text"
                  id="lname"
                  name="lname"
                  value={formData.lname}
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
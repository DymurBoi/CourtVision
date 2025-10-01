import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/Login.css"
import basketballCourt from "../assets/BasketballCourt.jpg"
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
function PlayerRegistration() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    birthDate: ""
  })
 
  const navigate = useNavigate()
 const [showPassword, setShowPassword] = useState(false)
 const handleClickShowPassword = () => setShowPassword((prev) => !prev)
 const handleMouseDownPassword = (event) => {
  event.preventDefault()
}

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
           <FormControl
                sx={{ m: 1, width: "100%", maxWidth: 400 }}
                variant="outlined"
                required
              >
                <InputLabel htmlFor="fname">First Name</InputLabel>
                <OutlinedInput
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  sx={{ bgcolor: "#F5F5F5", width: "100%" }}
                />
              </FormControl>
 
              <FormControl
                sx={{ m: 1, width: "100%", maxWidth: 400 }}
                variant="outlined"
                required
              >
                <InputLabel htmlFor="lname">Last Name</InputLabel>
                <OutlinedInput
                  id="lname"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  sx={{ bgcolor: "#F5F5F5", width: "100%" }}
                />
              </FormControl>
            </div>

 
           <FormControl
              sx={{ m: 1, width: "100%", maxWidth: 400 }}
              variant="outlined"
              required
            >
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                sx={{ bgcolor: "#F5F5F5", width: "100%" }}
              />
            </FormControl>


          <FormControl
            sx={{ m: 1, width: "100%", maxWidth: 400 }}
            variant="outlined"
            required
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              sx={{ bgcolor: "#F5F5F5", width: "100%" }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

             <FormControl
              sx={{ m: 1, width: "100%", maxWidth: 400 }}
              variant="outlined"
              required
            >
              <InputLabel shrink htmlFor="birthDate">
                Birth Date
              </InputLabel>
              <OutlinedInput
                id="birthDate"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                sx={{ bgcolor: "#F5F5F5", width: "100%" }}
              />
            </FormControl>
 
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
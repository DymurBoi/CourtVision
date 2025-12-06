import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../utils/axiosConfig"
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
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

function PlayerRegistration() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    position: ""
  })

  const [passwordError, setPasswordError] = useState("") // 👈 Add this line
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  const [confirmShowPassword, setConfirmShowPassword] = useState(false)
  const handleConfirmClickShowPassword = () => setConfirmShowPassword((prev) => !prev)
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const [birthDateError, setBirthDateError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Password match validation
    if (name === "confirmPassword" || name === "password") {
      if (
        (name === "confirmPassword" && value !== formData.password) ||
        (name === "password" && formData.confirmPassword && value !== formData.confirmPassword)
      ) {
        setPasswordError("Passwords do not match")
      } else {
        setPasswordError("")
      }
    }

    if (name === "birthDate") {
      const selectedYear = new Date(value).getFullYear();
      const currentYear = new Date().getFullYear();
      if (selectedYear >= currentYear) {
        setBirthDateError("Birth year cannot be this year or in the future");
      } else {
        setBirthDateError("");
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // client-side validations
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!pwdRegex.test(formData.password)) {
      setPasswordError("Password must be at least 8 chars and include uppercase, lowercase, number and special character")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (!formData.position) {
      alert("Please select your playing position.")
      return
    }

    if (birthDateError) {
      alert("Please correct your birth date before submitting.");
      return;
    }
    const { confirmPassword, ...payload } = formData

    try {
      const response = await api.post("/players/post", payload)
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
            <FormControl sx={{ m: 1, width: "100%", maxWidth: 400 }} variant="outlined" required>
              <InputLabel shrink htmlFor="fname">First Name</InputLabel>
              <OutlinedInput
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="Enter your first name"
                sx={{ bgcolor: "#F5F5F5", width: "100%" }}
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: "100%", maxWidth: 400 }} variant="outlined" required>
              <InputLabel shrink htmlFor="lname">Last Name</InputLabel>
              <OutlinedInput
                id="lname"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Enter your last name"
                sx={{ bgcolor: "#F5F5F5", width: "100%" }}
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: "100%", maxWidth: 400 }} variant="outlined" required>
              <InputLabel shrink htmlFor="email">Email</InputLabel>
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

            <FormControl sx={{ m: 1, width: "100%", maxWidth: 400 }} variant="outlined" required error={Boolean(passwordError)}>
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
              {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
            </FormControl>

            {/* ✅ Confirm Password with inline error */}
            <FormControl
              sx={{ m: 1, width: "100%", maxWidth: 400 }}
              variant="outlined"
              required
              error={Boolean(passwordError)}
            >
              <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirmPassword"
                type={confirmShowPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                sx={{ bgcolor: "#F5F5F5", width: "100%" }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleConfirmClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
            </FormControl>

            <FormControl
              sx={{ m: 1, width: "100%", maxWidth: 400 }}
              variant="outlined"
              required
              error={Boolean(birthDateError)}
            >
              <InputLabel shrink htmlFor="birthDate">Birth Date</InputLabel>
              <OutlinedInput
                id="birthDate"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                sx={{ bgcolor: "#F5F5F5", width: "100%" }}
              />
              {birthDateError && <FormHelperText>{birthDateError}</FormHelperText>}
            </FormControl>

            <FormControl sx={{ m: 1, width: "100%", maxWidth: 400 }} variant="outlined" required>
              <InputLabel id="position-label">Position</InputLabel>
              <Select
                labelId="position-label"
                id="position"
                name="position"
                value={formData.position}
                label="Position"
                onChange={handleChange}
                sx={{ bgcolor: "#F5F5F5", width: "100%" }}
              >
                <MenuItem value={"Point Guard"}>Point Guard</MenuItem>
                <MenuItem value={"Shooting Guard"}>Shooting Guard</MenuItem>
                <MenuItem value={"Small Forward"}>Small Forward</MenuItem>
                <MenuItem value={"Power Forward"}>Power Forward</MenuItem>
                <MenuItem value={"Center"}>Center</MenuItem>
              </Select>
              <FormHelperText>Select your primary playing position</FormHelperText>
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

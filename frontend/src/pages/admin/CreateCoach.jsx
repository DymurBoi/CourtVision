"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  FormHelperText
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import "../../styles/admin/UserForm.css"
import axios from "axios"

function CreateCoach() {
  const [showPassword, setShowPassword] = useState(false)
  const [confirmShowPassword, setConfirmShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [birthDateError, setBirthDateError] = useState("");

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: ""
  })

  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  const handleConfirmClickShowPassword = () => setConfirmShowPassword((prev) => !prev)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // 👇 Real-time validation
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

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    try {
      const response = await axios.post("http://localhost:8080/api/coaches/post", formData)
      console.log("Coach created:", response.data)
      alert("Coach created successfully!")
      navigate("/admin/users?type=coach")
    } catch (error) {
      console.error("Error creating coach:", error)
      alert("Failed to create coach. Please check your input.")
    }
  }

  return (
    <div className="admin-layout">
      <main className="admin-content">
        <div className="admin-header">
          <h1>Create Coach Account</h1>
          <p>Add a new coach to the system</p>
        </div>

        <div className="user-form-container">
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-section">
              <h2>Basic Information</h2>

              <div className="form-row">
                <FormControl sx={{ width: "15ch" }} variant="outlined" required>
                  <InputLabel htmlFor="fname">First Name</InputLabel>
                  <OutlinedInput
                    id="fname"
                    name="fname"
                    type="text"
                    value={formData.fname}
                    onChange={handleChange}
                    sx={{ bgcolor: "#ffffffff", width: 440 }}
                  />
                </FormControl>

                <FormControl sx={{ marginLeft: 25, width: "15ch" }} variant="outlined" required>
                  <InputLabel htmlFor="lname">Last Name</InputLabel>
                  <OutlinedInput
                    id="lname"
                    name="lname"
                    type="text"
                    value={formData.lname}
                    onChange={handleChange}
                    sx={{ bgcolor: "#ffffffff", width: 440 }}
                  />
                </FormControl>
              </div>

              <div className="form-row">
                <FormControl sx={{ width: "25ch" }} variant="outlined" required>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ bgcolor: "#ffffffff", width: 440 }}
                  />
                </FormControl>

                <FormControl sx={{ marginLeft: 25, width: "25ch" }} variant="outlined" required>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ bgcolor: "#ffffffff", width: 440 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>

              <div className="form-row">
                <FormControl
                  sx={{ width: "25ch" }}
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
                    sx={{ bgcolor: "#F5F5F5", width: 440 }}
                  />
                  {birthDateError && <FormHelperText>{birthDateError}</FormHelperText>}
                </FormControl>
                <FormControl
                  sx={{ marginLeft: 25, width: "25ch" }}
                  variant="outlined"
                  required
                  error={Boolean(passwordError)}
                >
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmShowPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    sx={{ bgcolor: "#ffffffff", width: 440 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={handleConfirmClickShowPassword} edge="end">
                          {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {passwordError && (
                    <FormHelperText>{passwordError}</FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Create Coach
              </button>
              <Link to="/admin/users" className="cancel-button">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateCoach

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
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import "../../styles/admin/UserForm.css"
import axios from "axios"
 
function CreateCoach() {
  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    birthDate: ""
  })
 
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

<FormControl sx={{  width: "15ch" }} variant="outlined" required>
  <InputLabel htmlFor="fname">First Name</InputLabel>
  <OutlinedInput
    id="fname"
    name="fname" // Added name attribute
    type="text"
    value={formData.fname}
    onChange={handleChange}  // Ensure handleChange is used
    sx={{ bgcolor: "#ffffffff", width: 440 }}
  />
</FormControl>


<FormControl sx={{ marginLeft: 25, width: "15ch" }} variant="outlined" required>
  <InputLabel htmlFor="lname">Last Name</InputLabel>
  <OutlinedInput
    id="lname"
    name="lname" // Added name attribute
    type="text"
    value={formData.lname}
    onChange={handleChange}  // Ensure handleChange is used
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
    type={showPassword ? "text" : "password"} // Toggle between text and password
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
<FormControl sx={{  width: "25ch" }} variant="outlined" required>
  <TextField
    id="birthDate"
    name="birthDate"
    label="Birth Date"
    type="date"
    value={formData.birthDate}
    onChange={handleChange}
    sx={{ bgcolor: "#ffffffff", width: 440 }}
    InputLabelProps={{
      shrink: true, // Ensures the label stays above the input when the date is selected
    }}
  />
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
"use client"
 
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import "../../styles/admin/UserForm.css"
import axios from "axios"
 
function CreateCoach() {
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
<div className="form-group">
<label htmlFor="fname">First Name</label>
<input
                    type="text"
                    id="fname"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    required
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
                  />
</div>
</div>
 
              <div className="form-row">
<div className="form-group">
<label htmlFor="email">Email</label>
<input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                  />
</div>
</div>
 
              <div className="form-row">
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
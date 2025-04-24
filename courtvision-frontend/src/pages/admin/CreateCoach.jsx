"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import "../../styles/admin/UserForm.css"

function CreateCoach() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    team: "",
    status: "active",
    experience: "",
    specialization: "",
  })

  // Teams data
  const teams = ["CIT-U College Team", "CIT-U High School Team", "CIT-U Elementary Team"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would make an API call to create the coach
    console.log("Creating coach:", formData)
    // Redirect to user management page
    navigate("/admin/users?type=coach")
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
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
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
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
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
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
                  <label htmlFor="team">Team</label>
                  <select id="team" name="team" value={formData.team} onChange={handleChange} required>
                    <option value="">Select Team</option>
                    {teams.map((team, index) => (
                      <option key={index} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Coach Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience">Experience</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 10 years"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="specialization">Specialization</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Defensive strategies"
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

"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import "../../styles/admin/UserForm.css"

// Sample user data
const usersData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    type: "player",
    team: "CIT-U College Team",
    status: "active",
    createdAt: "2023-01-15",
    birthDate: "1998-05-20",
    jerseyNumber: 23,
    position: "Point Guard",
    height: 185,
    weight: 78,
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Thompson",
    email: "michael.thompson@example.com",
    password: "coach123",
    type: "coach",
    team: "CIT-U College Team",
    status: "active",
    createdAt: "2022-11-05",
    experience: "12 years",
    specialization: "Offensive strategies",
  },
]

function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    type: "",
    team: "",
    status: "active",
    birthDate: "",
    jerseyNumber: "",
    position: "",
    height: "",
    weight: "",
    experience: "",
    specialization: "",
  })

  // Teams data
  const teams = ["CIT-U College Team", "CIT-U High School Team", "CIT-U Elementary Team"]

  // Positions data
  const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"]

  useEffect(() => {
    // Simulate API call to fetch user details
    const fetchUser = () => {
      setLoading(true)
      // Find user by ID
      const foundUser = usersData.find((u) => u.id === Number(id))

      if (foundUser) {
        setFormData({
          ...formData,
          ...foundUser,
        })
      }
      setLoading(false)
    }

    fetchUser()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would make an API call to update the user
    console.log("Updating user:", formData)
    navigate(`/admin/users/${id}`)
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <main className="admin-content">
          <div className="loading">Loading user data...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <main className="admin-content">
        <div className="admin-header">
          <h1>Edit User</h1>
          <p>Update user information</p>
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
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">User Type</label>
                  <select id="type" name="type" value={formData.type} onChange={handleChange} disabled>
                    <option value="player">Player</option>
                    <option value="coach">Coach</option>
                  </select>
                  <small>User type cannot be changed</small>
                </div>
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
              </div>

              <div className="form-row">
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

            {formData.type === "player" && (
              <div className="form-section">
                <h2>Player Details</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="birthDate">Birth Date</label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="jerseyNumber">Jersey Number</label>
                    <input
                      type="number"
                      id="jerseyNumber"
                      name="jerseyNumber"
                      value={formData.jerseyNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="position">Position</label>
                    <select id="position" name="position" value={formData.position} onChange={handleChange}>
                      <option value="">Select Position</option>
                      {positions.map((position, index) => (
                        <option key={index} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="height">Height (cm)</label>
                    <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {formData.type === "coach" && (
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
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>
              <Link to={`/admin/users/${id}`} className="cancel-button">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default UserEdit

"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../components/AuthContext"
import "../../styles/player/P-Profile.css"

function PProfile() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Sample player data
  const [playerData, setPlayerData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "••••••••",
    birthDate: "1998-05-20",
    jerseyNumber: 23,
    position: "Point Guard",
    team: "CIT-U College Team",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ ...playerData })

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setPlayerData({ ...editedData })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedData({
      ...editedData,
      [name]: value,
    })
  }

  const handleCancel = () => {
    setEditedData({ ...playerData })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {playerData.firstName.charAt(0)}{playerData.lastName.charAt(0)}
          </div>
          <div className="profile-title">
            <h1>Player Profile</h1>
            <p>Manage your personal information</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <div className="profile-info">
              <div className="info-group">
                <label>First Name</label>
                {isEditing ? (
                  <input type="text" name="firstName" value={editedData.firstName} onChange={handleInputChange} />
                ) : (
                  <p>{playerData.firstName}</p>
                )}
              </div>

              <div className="info-group">
                <label>Last Name</label>
                {isEditing ? (
                  <input type="text" name="lastName" value={editedData.lastName} onChange={handleInputChange} />
                ) : (
                  <p>{playerData.lastName}</p>
                )}
              </div>

              <div className="info-group">
                <label>Email</label>
                {isEditing ? (
                  <input type="email" name="email" value={editedData.email} onChange={handleInputChange} />
                ) : (
                  <p>{playerData.email}</p>
                )}
              </div>

              <div className="info-group">
                <label>Password</label>
                {isEditing ? (
                  <input type="password" name="password" value={editedData.password} onChange={handleInputChange} />
                ) : (
                  <p>{playerData.password}</p>
                )}
              </div>

              <div className="info-group">
                <label>Birth Date</label>
                {isEditing ? (
                  <input type="date" name="birthDate" value={editedData.birthDate} onChange={handleInputChange} />
                ) : (
                  <p>{playerData.birthDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h2>Basketball Information</h2>
            <div className="profile-info">
              <div className="info-group">
                <label>Jersey Number</label>
                {isEditing ? (
                  <input type="number" name="jerseyNumber" value={editedData.jerseyNumber} onChange={handleInputChange} />
                ) : (
                  <p>#{playerData.jerseyNumber}</p>
                )}
              </div>

              <div className="info-group">
                <label>Position</label>
                {isEditing ? (
                  <input type="text" name="position" value={editedData.position} onChange={handleInputChange} />
                ) : (
                  <p>{playerData.position}</p>
                )}
              </div>

              <div className="info-group">
                <label>Team</label>
                <p>{playerData.team}</p>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="save-button" onClick={handleEditToggle}>
                  Save Changes
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="edit-button" onClick={handleEditToggle}>
                  Edit Profile
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default PProfile

"use client"

import { useState } from "react"
import "../styles/Profile.css"

function Profile() {
  // Sample user data
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "••••••••",
    birthDate: "1995-06-15",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ ...userData })

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUserData({ ...editedData })
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
    setEditedData({ ...userData })
    setIsEditing(false)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-picture-container">
            <div className="profile-picture">
              {/* Placeholder for profile picture */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {!isEditing && <button className="change-photo-button">Change Photo</button>}
            </div>
          </div>
          <div className="profile-title">
            <h1>
              {userData.firstName} {userData.lastName}
            </h1>
            <p>Basketball Player</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <h2>Personal Information</h2>

            <div className="info-group">
              <label>First Name</label>
              {isEditing ? (
                <input type="text" name="firstName" value={editedData.firstName} onChange={handleInputChange} />
              ) : (
                <p>{userData.firstName}</p>
              )}
            </div>

            <div className="info-group">
              <label>Last Name</label>
              {isEditing ? (
                <input type="text" name="lastName" value={editedData.lastName} onChange={handleInputChange} />
              ) : (
                <p>{userData.lastName}</p>
              )}
            </div>

            <div className="info-group">
              <label>Email</label>
              {isEditing ? (
                <input type="email" name="email" value={editedData.email} onChange={handleInputChange} />
              ) : (
                <p>{userData.email}</p>
              )}
            </div>

            <div className="info-group">
              <label>Password</label>
              {isEditing ? (
                <input type="password" name="password" value={editedData.password} onChange={handleInputChange} />
              ) : (
                <p>{userData.password}</p>
              )}
            </div>

            <div className="info-group">
              <label>Birth Date</label>
              {isEditing ? (
                <input type="date" name="birthDate" value={editedData.birthDate} onChange={handleInputChange} />
              ) : (
                <p>{formatDate(userData.birthDate)}</p>
              )}
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
                <button className="logout-button">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile


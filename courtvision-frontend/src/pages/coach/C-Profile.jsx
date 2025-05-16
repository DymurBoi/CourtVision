"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import "../../styles/coach/C-Profile.css";

function CProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Sample coach data
  const [coachData, setCoachData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "••••••••",
    birthDate: "1990-01-01",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...coachData });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setCoachData({ ...editedData });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setEditedData({ ...coachData });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {coachData.firstName.charAt(0)}{coachData.lastName.charAt(0)}
          </div>
          <div className="profile-title">
            <h1>Coach Profile</h1>
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
                  <input
                    type="text"
                    name="firstName"
                    value={editedData.firstName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{coachData.firstName}</p>
                )}
              </div>

              <div className="info-group">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editedData.lastName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{coachData.lastName}</p>
                )}
              </div>

              <div className="info-group">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{coachData.email}</p>
                )}
              </div>

              <div className="info-group">
                <label>Password</label>
                {isEditing ? (
                  <input
                    type="password"
                    name="password"
                    value={editedData.password}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{coachData.password}</p>
                )}
              </div>

              <div className="info-group">
                <label>Birth Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={editedData.birthDate}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{coachData.birthDate}</p>
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
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CProfile;


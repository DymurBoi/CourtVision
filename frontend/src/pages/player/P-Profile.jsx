"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-Profile.css"

function PProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)

  // Player data state
  const [playerData, setPlayerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "••••••••",
    birthDate: "",
    jerseyNumber: "",
    position: "",
    teamId: "",
    teamName: ""
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ ...playerData })

  // Fetch player data when component mounts
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!user || !user.id) {
        console.log("No user data available, redirecting to login");
        navigate("/login", { replace: true });
        return;
      }
      
      try {
        // Extract the numeric ID from the format "PLAYER_123"
        let playerId = user.id;
        
        if (typeof playerId === 'string' && playerId.startsWith("PLAYER_")) {
          playerId = playerId.substring(7); // Remove "PLAYER_" prefix
        }
        
        // Make sure ID is a number if the backend expects it
        if (playerId && !isNaN(Number(playerId))) {
          playerId = Number(playerId);
        }
        
        // Get player data using the API client
        const response = await api.get(`/players/get/${playerId}`);
        const data = response.data;
        
        if (!data) {
          console.error("Received empty data from API");
          setLoading(false);
          return;
        }

        // Map the backend field names to frontend field names
        setPlayerData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "••••••••", // Always mask password
          birthDate: data.birthDate || "",
          jerseyNumber: data.jerseyNum || "", // Using jerseyNum from backend
          position: data.position || "",
          teamId: data.teamId ? data.teamId.teamName : "",
          teamName:data.teamName ? data.teamName: "Not Assigned",
        });
        
        setEditedData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "••••••••",
          birthDate: data.birthDate || "",
          jerseyNumber: data.jerseyNum || "", // Using jerseyNum from backend
          position: data.position || "",
          team: data.team ? data.team.teamName : "Not assigned",
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching player data:", error);
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [user, navigate]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes to backend
      try {
        // Extract the numeric ID from the format "PLAYER_123"
        const playerId = user.id.startsWith("PLAYER_") 
          ? user.id.substring(7) // Remove "PLAYER_" prefix
          : user.id;
      
        const updateData = {
          fname: editedData.firstName,
          lname: editedData.lastName,
          email: editedData.email,
          birthDate: editedData.birthDate,
          jerseyNum: editedData.jerseyNumber, // Using jerseyNum for backend
          position: editedData.position,
        }
        
        // Only include password if it was changed
        if (editedData.password !== "••••••••") {
          updateData.password = editedData.password
        }
        
        await api.put(`/players/put/${playerId}`, updateData)
        
        // Update local state after successful save
        setPlayerData({ ...editedData })
      } catch (error) {
        console.error("Error updating player data:", error)
        alert("Failed to update profile. Please try again.")
        // Reset edited data to current player data
        setEditedData({ ...playerData })
        setIsEditing(false)
        return
      }
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

  if (loading) {
    return <div className="loading">Loading profile data...</div>
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
                  <p>#{playerData.jerseyNumber || "Not assigned"}</p>
                )}
              </div>

              <div className="info-group">
                <label>Position</label>
                {isEditing ? (
                  <input type="text" name="position" value={editedData.position} onChange={handleInputChange} />
                ) : (
                  <p>{playerData.position || "Not assigned"}</p>
                )}
              </div>

              <div className="info-group">
                <label>Team</label>
                <p>{playerData.teamName}</p>
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

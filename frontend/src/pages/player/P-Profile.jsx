"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import "../../styles/player/P-Profile.css"

function PProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)

  const [playerData, setPlayerData] = useState()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [editedData, setEditedData] = useState({ ...playerData })

  const handleClickShowPassword = () => setShowPassword((prev) => !prev)
  const handleMouseDownPassword = (event) => event.preventDefault()

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!user || !user.id) {
        console.log("No user data available, redirecting to login")
        navigate("/login", { replace: true })
        return
      }

      try {
        let playerId = user.id
        if (typeof playerId === "string" && playerId.startsWith("PLAYER_")) {
          playerId = playerId.substring(7)
        }
        if (playerId && !isNaN(Number(playerId))) {
          playerId = Number(playerId)
        }

        const response = await api.get(`/players/get/${playerId}`)
        const data = response.data
        if (!data) {
          console.error("Received empty data from API")
          setLoading(false)
          return
        }

        setPlayerData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "••••••••",
          birthDate: data.birthDate || "",
          jerseyNumber: data.jerseyNum ? data.jerseyNum : "",
          position: data.position || "",
          teamName: data.team ? data.team.teamName : "Not Assigned",
        })

        setEditedData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "••••••••",
          birthDate: data.birthDate || "",
          jerseyNumber: data.jerseyNum || "",
          position: data.position || "",
          teamName: data.team ? data.team.teamName : "Not assigned",
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching player data:", error)
        setLoading(false)
      }
    }

    fetchPlayerData()
  }, [user, navigate])

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const playerId = user.id.startsWith("PLAYER_") ? user.id.substring(7) : user.id

        const updateData = {
          fname: editedData.firstName,
          lname: editedData.lastName,
          email: editedData.email,
          birthDate: editedData.birthDate,
          jerseyNum: editedData.jerseyNumber,
          position: editedData.position,
        }

        if (editedData.password !== "••••••••") {
          updateData.password = editedData.password
        }

        await api.put(`/players/put/${playerId}`, updateData)
        setPlayerData({ ...editedData })
      } catch (error) {
        console.error("Error updating player data:", error)
        alert("Failed to update profile. Please try again.")
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

  if (loading) return <div className="loading">Loading profile data...</div>

  return (
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {playerData.firstName?.charAt(0)}
            {playerData.lastName?.charAt(0)}
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
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={isEditing ? editedData.firstName : playerData.firstName}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                  variant="outlined"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={isEditing ? editedData.lastName : playerData.lastName}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                  variant="outlined"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Email"
                  name="email"
                  value={isEditing ? editedData.email : playerData.email}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                  variant="outlined"
                />
              </FormControl>

              <FormControl
                sx={{ mb: 2, width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={isEditing ? editedData.password : playerData.password}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  endAdornment={
                    isEditing && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                  label="Password"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  value={isEditing ? editedData.birthDate : playerData.birthDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: !isEditing }}
                />
              </FormControl>
            </div>
          </div>

          <div className="profile-card">
            <h2>Basketball Information</h2>
            <div className="profile-info">
              <FormControl fullWidth sx={{ mb: 2 }}>
                {isEditing ? (
                  <TextField
                    label="Jersey Number"
                    name="jerseyNumber"
                    type="number"
                    value={editedData.jerseyNumber}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <TextField
                    label="Jersey Number"
                    value={playerData.jerseyNumber ? `#${playerData.jerseyNumber}` : "Not Assigned"}
                    InputProps={{ readOnly: true }}
                  />
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                {isEditing ? (
                  <select name="position" value={editedData.position} onChange={handleInputChange}>
                    <option value="">Select position</option>
                    <option value={"Point Guard"}>Point Guard</option>
                    <option value={"Shooting Guard"}>Shooting Guard</option>
                    <option value={"Small Forward"}>Small Forward</option>
                    <option value={"Power Forward"}>Power Forward</option>
                    <option value={"Center"}>Center</option>
                  </select>
                ) : (
                  <TextField
                    label="Position"
                    value={playerData.position || "Not assigned"}
                    InputProps={{ readOnly: true }}
                  />
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Team"
                  value={playerData.teamName}
                  InputProps={{ readOnly: true }}
                />
              </FormControl>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <Button variant="contained" color="success" onClick={handleEditToggle}>
                  Save Changes
                </Button>
                <Button variant="outlined" color="error" onClick={handleCancel} sx={{ ml: 2 }}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" onClick={handleEditToggle}>
                  Edit Profile
                </Button>
                <Button variant="outlined" color="error" onClick={handleLogout} sx={{ ml: 2 }}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default PProfile

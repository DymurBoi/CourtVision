"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../../styles/coach/C-Profile.css";

function CProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  const [coachData, setCoachData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  useEffect(() => {
    const fetchCoachData = async () => {
      if (!user || !user.id) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        let coachId = user.id;
        if (typeof coachId === "string" && coachId.startsWith("COACH_")) {
          coachId = coachId.substring(6);
        }

        const response = await api.get(`/coaches/get/${coachId}`);
        const data = response.data;

        setCoachData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "", // hidden for security
          birthDate: data.birthDate || "",
        });

        setEditedData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "",
          birthDate: data.birthDate || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching coach data:", error);
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [user, navigate]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const coachId = user.id.startsWith("COACH_")
          ? user.id.substring(6)
          : user.id;

        const updateData = {
          fname: editedData.firstName,
          lname: editedData.lastName,
          email: editedData.email,
          birthDate: editedData.birthDate,
        };

        if (editedData.password && editedData.password !== "••••••••") {
          updateData.password = editedData.password;
        }

        await api.put(`/coaches/put/${coachId}`, updateData);
        setCoachData({ ...editedData });
      } catch (error) {
        console.error("Error updating coach data:", error);
        alert("Failed to update profile. Please try again.");
        setEditedData({ ...coachData });
        setIsEditing(false);
        return;
      }
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

  if (loading) return <div className="loading">Loading profile data...</div>;

  return (
    <main className="main-content">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {coachData.firstName?.charAt(0)}
            {coachData.lastName?.charAt(0)}
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
              {/* First Name */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={isEditing ? editedData.firstName : coachData.firstName}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                  variant="outlined"
                />
              </FormControl>

              {/* Last Name */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={isEditing ? editedData.lastName : coachData.lastName}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                  variant="outlined"
                />
              </FormControl>

              {/* Email */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Email"
                  name="email"
                  value={isEditing ? editedData.email : coachData.email}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                  variant="outlined"
                />
              </FormControl>

              {/* Birth Date */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  value={isEditing ? editedData.birthDate : coachData.birthDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: !isEditing }}
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
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancel}
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" onClick={handleEditToggle}>
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CProfile;

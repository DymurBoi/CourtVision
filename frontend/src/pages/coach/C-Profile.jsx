"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-Profile.css";

function CProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  // Coach data state
  const [coachData, setCoachData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "••••••••",
    birthDate: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...coachData });

  // Fetch coach data when component mounts
  useEffect(() => {
    const fetchCoachData = async () => {
      if (!user || !user.id) {
        console.log("No user data available, redirecting to login");
        navigate("/login", { replace: true });
        return;
      }

      console.log("Raw user data from AuthContext:", user);
      
      try {
        // Extract the numeric ID from the format "COACH_123"
        let coachId = user.id;
        let originalId = coachId; // Save for debugging
        
        if (typeof coachId === 'string' && coachId.startsWith("COACH_")) {
          coachId = coachId.substring(6); // Remove "COACH_" prefix
          console.log("Extracted numeric coach ID:", coachId, "from original:", originalId);
        } else {
          console.log("Using ID as-is (no prefix detected):", coachId);
        }
        
        // Make sure ID is a number if the backend expects it
        if (coachId && !isNaN(Number(coachId))) {
          coachId = Number(coachId);
        }
        
        console.log("Attempting to fetch coach profile with ID:", coachId, "Type:", typeof coachId);
        
        // Check authToken before making the request
        const authToken = localStorage.getItem('authToken');
        console.log("Auth token present:", authToken ? "YES" : "NO");
        if (authToken) {
          console.log("Token preview:", authToken.substring(0, 20) + "...");
        }
        
        // Get coach data using the api client (which adds auth headers)
        const response = await api.get(`/coaches/get/${coachId}`);
        console.log("API response status:", response.status);
        const data = response.data;
        
        console.log("Coach profile data received (raw):", data);
        
        if (!data) {
          console.error("Received empty data from API");
          setLoading(false);
          return;
        }
        
        // Check if essential fields exist
        if (!data.fname || !data.lname) {
          console.warn("Missing name data in API response:", data);
        }

        // Map the backend field names to frontend field names
        setCoachData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "••••••••", // Always mask password
          birthDate: data.birthDate || "",
        });
        
        setEditedData({
          firstName: data.fname || "",
          lastName: data.lname || "",
          email: data.email || "",
          password: "••••••••",
          birthDate: data.birthDate || "",
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coach data:", error);
        if (error.response) {
          console.error("Response error status:", error.response.status);
          console.error("Response error data:", error.response.data);
        } else if (error.request) {
          console.error("Network error - no response received");
        } else {
          console.error("Error setting up request:", error.message);
        }
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [user, navigate]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes to backend
      try {
        // Extract the numeric ID from the format "COACH_123"
        const coachId = user.id.startsWith("COACH_") 
          ? user.id.substring(6) // Remove "COACH_" prefix
          : user.id;
      
        const updateData = {
          fname: editedData.firstName,
          lname: editedData.lastName,
          email: editedData.email,
          birthDate: editedData.birthDate,
        };
        
        // Only include password if it was changed
        if (editedData.password !== "••••••••") {
          updateData.password = editedData.password;
        }
        
        await api.put(`/coaches/put/${coachId}`, updateData);
        
        // Update local state after successful save
        setCoachData({ ...editedData });
      } catch (error) {
        console.error("Error updating coach data:", error);
        alert("Failed to update profile. Please try again.");
        // Reset edited data to current coach data
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

  if (loading) {
    return <div className="loading">Loading profile data...</div>;
  }

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


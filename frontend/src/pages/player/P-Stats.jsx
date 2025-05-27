"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-Stats.css"

function PStats() {
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [requestStatus, setRequestStatus] = useState(""); // For displaying request status
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state

  const [physicalRecords, setPhysicalRecords] = useState({
    height: 185, // cm
    weight: 78, // kg
    wingspan: 190, // cm
    vertical: 76, // cm
    lastUpdated: "2023-03-15",
  })

  const [editedRecords, setEditedRecords] = useState({ ...physicalRecords })

  const [performanceStats] = useState({
    gamesPlayed: 15,
    pointsPerGame: 12.5,
    reboundsPerGame: 4.2,
    assistsPerGame: 3.8,
    stealsPerGame: 1.2,
    blocksPerGame: 0.5,
    fieldGoalPercentage: 45.2,
    threePointPercentage: 36.8,
    freeThrowPercentage: 82.5,
  })

  // Calculate BMI
  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedRecords({ ...physicalRecords })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedRecords({
      ...editedRecords,
      [name]: Number.parseFloat(value),
    })
  }

  const handleApplyChanges = async () => {
    try {
      console.log("Preparing to submit physical update request");
      
      // Check authentication token
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Error: You are not logged in. Please login and try again.");
        return;
      }
      
      console.log("Auth token found, first 10 chars:", token.substring(0, 10) + "...");
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("Error: User ID not found. Please login again.");
        return;
      }
      
      const playerId = userId.includes('_') ? userId.split('_')[1] : userId;
      console.log("Using player ID:", playerId);
      
      const coachId = 1;
      
      const requestData = {
        playerId: playerId,
        coachId: coachId,
        height: editedRecords.height.toString(),
        weight: editedRecords.weight.toString(),
        wingspan: editedRecords.wingspan.toString(),
        vertical: editedRecords.vertical.toString(),
        dateRequested: new Date().toISOString().split('T')[0],
        requestStatus: 0
      };
      
      console.log("Sending request with data:", requestData);

      try {
        const response = await api.post('/physical-update-requests', requestData);
        
        if (response.status === 200) {
          alert("Your physical record update request has been submitted successfully. Your coach will review and approve the changes.");
          setRequestStatus("Request submitted successfully. Awaiting coach approval.");
          setShowConfirmation(true);
          setIsEditing(false);
        } else {
          alert(`Error: Request failed with status ${response.status}`);
          setRequestStatus(`Error: Request failed with status ${response.status}`);
          setShowConfirmation(true);
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        let errorText = "Failed to submit request";
        if (apiError.response) {
          errorText = apiError.response.data.message || apiError.response.data.error || `Server returned status ${apiError.response.status}`;
        } else if (apiError.request) {
          errorText = "No response from server. Please check your connection.";
        } else {
          errorText = apiError.message;
        }
        alert(`Error: ${errorText}`);
        setRequestStatus(`Error: ${errorText}`);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("General error in handleApplyChanges:", error);
      alert("Error connecting to server. Please try again.");
      setRequestStatus("Error connecting to server. Please try again.");
      setShowConfirmation(true);
    }

    // Hide confirmation after 5 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setRequestStatus("");
    }, 5000);
  };

  // Add a refresh function
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    setRefreshTrigger(prev => prev + 1);
  };

  // Fetch player stats from API - add refreshTrigger dependency
  useEffect(() => {
    if (user && user.id) {
      const fetchPlayerStats = async () => {
        try {
          console.log("Fetching physical records data");
          // Extract player ID
          let playerId = user.id;
          if (typeof playerId === 'string' && playerId.startsWith("PLAYER_")) {
            playerId = playerId.substring(7); // Remove "PLAYER_" prefix
          }
          
          // Use API client for consistency with other requests
          try {
            const recordsResponse = await api.get(`/physical-records/get/by-player/${playerId}`);
            
            console.log("Physical records response:", recordsResponse.status);
            const recordsData = recordsResponse.data;
            
            console.log("Received physical records:", recordsData);
            if (recordsData) {
              setPhysicalRecords({
                height: recordsData.height || 185,
                weight: recordsData.weight || 78,
                wingspan: recordsData.wingspan || 190,
                vertical: recordsData.vertical || 76,
                lastUpdated: recordsData.dateRecorded || "2023-03-15"
              });
              setEditedRecords({
                height: recordsData.height || 185,
                weight: recordsData.weight || 78,
                wingspan: recordsData.wingspan || 190,
                vertical: recordsData.vertical || 76,
                lastUpdated: recordsData.dateRecorded || "2023-03-15"
              });
            }
          } catch (apiError) {
            console.error("Error fetching physical records:", apiError);
            if (apiError.response) {
              console.error("Error response status:", apiError.response.status);
            }
          }
          
          // Fetch performance stats (if available)
          // This would be implemented similarly
        } catch (error) {
          console.error("Error fetching player stats:", error);
        }
      };
      
      fetchPlayerStats();
    }
  }, [user, refreshTrigger]); // Add refreshTrigger as dependency

  return (
    <div className="stats-container">
      <h1 className="page-title">My Statistics</h1>
      <p className="page-subtitle">View your physical records and performance statistics</p>

      <div className="stats-card">
        <div className="stats-card-header">
          <h2>Physical Records</h2>
          <div className="header-actions">
            <span className="last-updated">Last updated: {physicalRecords.lastUpdated}</span>
            <button className={`edit-button ${isEditing ? "cancel" : ""}`} onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        <div className="physical-records-grid">
          {/* Height */}
          <div className="record-item">
            {!isEditing ? (
              <>
                <div className="record-icon height-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </div>
                <div className="record-details">
                  <div className="record-value">{physicalRecords.height} cm</div>
                  <div className="record-label">Height</div>
                </div>
              </>
            ) : (
              <div className="record-edit">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={editedRecords.height}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* Weight */}
          <div className="record-item">
            {!isEditing ? (
              <>
                <div className="record-icon weight-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12h8"/>
                  </svg>
                </div>
                <div className="record-details">
                  <div className="record-value">{physicalRecords.weight} kg</div>
                  <div className="record-label">Weight</div>
                </div>
              </>
            ) : (
              <div className="record-edit">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={editedRecords.weight}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* Wingspan */}
          <div className="record-item">
            {!isEditing ? (
              <>
                <div className="record-icon wingspan-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 12h12M3 6l3 6-3 6M21 6l-3 6 3 6"/>
                  </svg>
                </div>
                <div className="record-details">
                  <div className="record-value">{physicalRecords.wingspan} cm</div>
                  <div className="record-label">Wingspan</div>
                </div>
              </>
            ) : (
              <div className="record-edit">
                <label htmlFor="wingspan">Wingspan (cm)</label>
                <input
                  type="number"
                  id="wingspan"
                  name="wingspan"
                  value={editedRecords.wingspan}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* Vertical */}
          <div className="record-item">
            {!isEditing ? (
              <>
                <div className="record-icon vertical-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </div>
                <div className="record-details">
                  <div className="record-value">{physicalRecords.vertical} cm</div>
                  <div className="record-label">Vertical</div>
                </div>
              </>
            ) : (
              <div className="record-edit">
                <label htmlFor="vertical">Vertical (cm)</label>
                <input
                  type="number"
                  id="vertical"
                  name="vertical"
                  value={editedRecords.vertical}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          {/* BMI */}
          <div className="record-item">
            <div className="record-icon bmi-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20M12 2v20"/>
              </svg>
            </div>
            <div className="record-details">
              <div className="record-value">{calculateBMI(physicalRecords.height, physicalRecords.weight)}</div>
              <div className="record-label">BMI</div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="edit-actions">
            <button className="apply-button" onClick={handleApplyChanges}>
              Apply Changes
            </button>
          </div>
        )}
      </div>

      <div className="stats-card">
        <div className="stats-card-header">
          <h2>Performance Statistics</h2>
          <div className="header-actions">
            <span className="games-played">Games Played: {performanceStats.gamesPlayed}</span>
          </div>
        </div>

        <div className="performance-stats-grid">
          <div className="stat-box">
            <div className="stat-value">{performanceStats.pointsPerGame}</div>
            <div className="stat-label">Points Per Game</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{performanceStats.reboundsPerGame}</div>
            <div className="stat-label">Rebounds Per Game</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{performanceStats.assistsPerGame}</div>
            <div className="stat-label">Assists Per Game</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{performanceStats.stealsPerGame}</div>
            <div className="stat-label">Steals Per Game</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{performanceStats.blocksPerGame}</div>
            <div className="stat-label">Blocks Per Game</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{performanceStats.fieldGoalPercentage}%</div>
            <div className="stat-label">Field Goal %</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{performanceStats.threePointPercentage}%</div>
            <div className="stat-label">3-Point %</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{performanceStats.freeThrowPercentage}%</div>
            <div className="stat-label">Free Throw %</div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className={`confirmation-message ${requestStatus.includes('Error') ? 'error' : ''}`}>
          {requestStatus || "Your request for physical record changes has been submitted for approval."}
        </div>
      )}
    </div>
  )
}

export default PStats

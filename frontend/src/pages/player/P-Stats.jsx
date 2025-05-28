"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-Stats.css"

function PStats() {
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [requestStatus, setRequestStatus] = useState("")
  const { user } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [physicalRecords, setPhysicalRecords] = useState({
    height: 0,
    weight: 0,
    wingspan: 0,
    vertical: 0,
    lastUpdated: "2023-03-15",
  })

  const [editedRecords, setEditedRecords] = useState({ ...physicalRecords })

  const [playerAverages, setPlayerAverages] = useState({
    pointsPerGame: 0,
    reboundsPerGame: 0,
    assistsPerGame: 0,
    stealsPerGame: 0,
    blocksPerGame: 0,
    minutesPerGame: 0,
    trueShootingPercentage: 0,
    usagePercentage: 0,
    offensiveRating: 0,
    defensiveRating: 0,
  })

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const handleEditToggle = () => {
    if (isEditing) {
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
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Error: You are not logged in. Please login and try again.")
        return
      }

      const userId = localStorage.getItem("userId")
      if (!userId) {
        alert("Error: User ID not found. Please login again.")
        return
      }

      const playerId = userId.includes("_") ? userId.split("_")[1] : userId
      const coachId = 1

      const requestData = {
        playerId: playerId,
        coachId: coachId,
        height: editedRecords.height.toString(),
        weight: editedRecords.weight.toString(),
        wingspan: editedRecords.wingspan.toString(),
        vertical: editedRecords.vertical.toString(),
        dateRequested: new Date().toISOString().split("T")[0],
        requestStatus: 0,
      }

      const response = await api.post("/physical-update-requests", requestData)

      if (response.status === 200) {
        alert("Your physical record update request has been submitted successfully. Your coach will review it.")
        setRequestStatus("Request submitted successfully. Awaiting coach approval.")
        setShowConfirmation(true)
        setIsEditing(false)
      } else {
        alert(`Error: Request failed with status ${response.status}`)
        setRequestStatus(`Error: Request failed with status ${response.status}`)
        setShowConfirmation(true)
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      setRequestStatus("Error submitting request. Please try again.")
      setShowConfirmation(true)
    }

    setTimeout(() => {
      setShowConfirmation(false)
      setRequestStatus("")
    }, 5000)
  }

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    if (user && user.id) {
      const fetchData = async () => {
        try {
          let playerId = user.id
          if (typeof playerId === "string" && playerId.startsWith("PLAYER_")) {
            playerId = playerId.substring(7)
          }

          // Fetch physical records (UNCHANGED)
          const recordsResponse = await api.get(`/physical-records/get/by-player/${playerId}`)
          const recordsData = recordsResponse.data

          if (recordsData) {
            setPhysicalRecords({
              height: recordsData.height || 0,
              weight: recordsData.weight || 0,
              wingspan: recordsData.wingspan || 0,
              vertical: recordsData.vertical || 0,
              lastUpdated: recordsData.dateRecorded || "2023-03-15",
            })
            setEditedRecords({
              height: recordsData.height || 0,
              weight: recordsData.weight || 0,
              wingspan: recordsData.wingspan || 0,
              vertical: recordsData.vertical || 0,
            })
          }

          // Fetch player performance averages
          const averagesResponse = await api.get(`/averages/get/by-player/${playerId}`)
          const avg = averagesResponse.data

          if (avg) {
            setPlayerAverages({
              pointsPerGame: avg.pointsPerGame || 0,
              reboundsPerGame: avg.reboundsPerGame || 0,
              assistsPerGame: avg.assistsPerGame || 0,
              stealsPerGame: avg.stealsPerGame || 0,
              blocksPerGame: avg.blocksPerGame || 0,
              minutesPerGame: avg.minutesPerGame || 0,
              trueShootingPercentage: avg.trueShootingPercentage || 0,
              usagePercentage: avg.usagePercentage || 0,
              offensiveRating: avg.offensiveRating || 0,
              defensiveRating: avg.defensiveRating || 0,
            })
          }
        } catch (error) {
          console.error("Error fetching player data:", error)
        }
      }

      fetchData()
    }
  }, [user, refreshTrigger])

  return (
    <div className="stats-container">
      <h1 className="page-title">My Statistics</h1>
      <p className="page-subtitle">View your physical records and performance averages</p>

     
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

      {/* PERFORMANCE AVERAGES (ALWAYS SHOW, EVEN IF EMPTY) */}
      <div className="stats-card">
        <div className="stats-card-header">
          <h2>Performance Averages</h2>
          <div className="header-actions">
            <span className="games-played">
              Minutes Per Game: {playerAverages.minutesPerGame.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="performance-stats-grid">
          {[{ label: "Points Per Game", value: playerAverages.pointsPerGame },
            { label: "Rebounds Per Game", value: playerAverages.reboundsPerGame },
            { label: "Assists Per Game", value: playerAverages.assistsPerGame },
            { label: "Steals Per Game", value: playerAverages.stealsPerGame },
            { label: "Blocks Per Game", value: playerAverages.blocksPerGame },
            { label: "True Shooting %", value: playerAverages.trueShootingPercentage, suffix: "%" },
            { label: "Usage %", value: playerAverages.usagePercentage, suffix: "%" },
            { label: "Offensive Rating", value: playerAverages.offensiveRating },
            { label: "Defensive Rating", value: playerAverages.defensiveRating },
          ].map((item) => (
            <div className="stat-box" key={item.label}>
              <div className="stat-value">
                {item.value !== null && item.value !== undefined ? item.value.toFixed(1) : "0"}
                {item.suffix || ""}
              </div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {showConfirmation && (
        <div className={`confirmation-message ${requestStatus.includes("Error") ? "error" : ""}`}>
          {requestStatus || "Your request for physical record changes has been submitted for approval."}
        </div>
      )}
    </div>
  )
}

export default PStats

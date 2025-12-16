"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { Snackbar, Alert } from "@mui/material"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-Home.css"

function PHome() {
  const hasLoadedOnce = useRef(false)
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [playerData, setPlayerData] = useState({
    id: null,
    fname: "",
    lname: "",
    email: "",
    jerseyNum: "",
    position: "",
    team: null
  })
  const [availableTeams, setAvailableTeams] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)


  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  })

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity })
  }

  // Fetch player data
  const fetchPlayerData = useCallback(async () => {
    if (!user || !user.id) {
      setLoading(false)
      return
    }

    if (!hasLoadedOnce.current) {
      setLoading(true)
    }

    try {
      let playerId = user.id
      if (typeof playerId === "string" && playerId.startsWith("PLAYER_")) {
        playerId = playerId.substring(7)
      }
      if (playerId && !isNaN(Number(playerId))) {
        playerId = Number(playerId)
      }

      const timestamp = new Date().getTime()
      const response = await api.get(`/players/get/${playerId}?t=${timestamp}`)
      const data = response.data

      if (!data) {
        setLoading(false)
        showSnackbar("No player data found", "warning")
        return
      }

      setPlayerData({
        id: data.playerId,
        fname: data.fname || "",
        lname: data.lname || "",
        email: data.email || "",
        jerseyNum: data.jerseyNum,
        position: data.position || "Not assigned",
        team: data.team
      })

      // Fetch pending requests
      try {
        const requestsResponse = await api.get(`/join-requests/by-player/${playerId}?t=${timestamp}`)
        if (requestsResponse.data && Array.isArray(requestsResponse.data)) {
          const pendingReqs = requestsResponse.data.map(req => ({
            requestId: req.requestId,
            teamId: req.teamId,
            status: req.requestStatus
          }))
          setPendingRequests(pendingReqs)
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error)
        showSnackbar("Failed to fetch pending requests", "error")
      }

      setLoading(false)
      hasLoadedOnce.current = true
    } catch (error) {
      console.error("Error fetching player data:", error)
      showSnackbar("Failed to fetch player data", "error")
      setLoading(false)
    } finally{
      setLoading(false)
    }
  }, [user])

  // Initial and refresh fetch
useEffect(() => {
  if (!user || !user.id) return

  fetchPlayerData()

  // Poll every 10 seconds (adjust as needed)
  const intervalId = setInterval(() => {
    fetchPlayerData()
  }, 10000)

  // Cleanup on unmount
  return () => clearInterval(intervalId)
}, [user, fetchPlayerData])


  // Fetch available teams if player has none
  useEffect(() => {
    if (!playerData.team) {
      api.get("/teams/get/all")
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            const teams = res.data.map(team => ({
              id: team.teamId,
              name: team.teamName,
              description: team.teamName + " team",
              coach:
                team.coaches && team.coaches.length > 0
                  ? team.coaches.map(c => c.fname + " " + c.lname).join(", ")
                  : "No coach assigned",
              coachId:
                team.coaches && team.coaches.length > 0 ? team.coaches[0].coachId : null
            }))
            setAvailableTeams(teams)
          }
        })
        .catch(() => {
          showSnackbar("Failed to fetch available teams", "error")
          setAvailableTeams([])
        })
    }
  }, [playerData.team])

  // Fetch team members when player has a team
  useEffect(() => {
    if (playerData.team && playerData.team.teamId) {
      api.get(`/players/get/by-team/${playerData.team.teamId}`)
        .then(response => {
          const members = response.data.map(player => ({
            id: player.playerId,
            firstName: player.fname,
            lastName: player.lname,
            jerseyNumber: player.jerseyNum || 0,
            position: player.position || "Unknown",
            avatar: player.fname ? player.fname.charAt(0) : "P"
          }))
          setTeamMembers(members)
        })
        .catch(() => {
          showSnackbar("Failed to fetch team members", "error")
          setTeamMembers([])
        })
    }
  }, [playerData.team])

  const handleApplyClick = (team) => {
    setSelectedTeam(team)
    setShowApplyModal(true)
  }

  const handleApplyConfirm = async () => {
    if (!playerData.id || !selectedTeam.id || !selectedTeam.coachId) {
      showSnackbar("Missing required data. Please try again.", "warning")
      return
    }

    try {
      const response = await api.post("/join-requests/post", {
        playerId: Number(playerData.id),
        teamId: selectedTeam.id
      })

      if (response.status === 200) {
        setPendingRequests(prev => [
          ...prev,
          { teamId: selectedTeam.id, status: 0 }
        ])
        setShowApplyModal(false)
        showSnackbar("Your request has been sent to the coach for approval.", "success")
      }
    } catch (error) {
      console.error("Failed to send join request:", error)
      showSnackbar("Failed to send join request. Please try again.", "error")
    }
  }

  if (loading) {
    return <div className="loading">Loading player data...</div>
  }

  // No Team View
  if (!playerData.team) {
    return (
      <main className="main-content">
        <div className="player-welcome first-login">
          <div className="player-avatar">
            <span>{playerData.fname ? playerData.fname.charAt(0) : "P"}</span>
          </div>
          <div className="player-welcome-text">
            <h1>Welcome, {playerData.fname}</h1>
            <p>Please select a team to join</p>
          </div>
        </div>

        <div className="available-teams-section">
          <h2>Available Teams ({availableTeams.length})</h2>
          {availableTeams.length > 0 ? (
            <div className="available-teams-grid">
              {availableTeams.map((team) => {
                const isPending = pendingRequests.some(req => req.teamId === team.id && req.status === 0)
                return (
                  <div className="available-team-card" key={team.id}>
                    <div className="team-banner college"></div>
                    <div className="team-content">
                      <h3>{team.name}</h3>
                      <p>{team.description}</p>
                      <div className="team-meta">
                        <div className="meta-item">
                          <span className="meta-label">Coach:</span>
                          <span className="meta-value">{team.coach}</span>
                        </div>
                      </div>
                      {isPending ? (
                        <div className="application-status pending">
                          Request pending approval...
                        </div>
                      ) : (
                        <button
                          className="apply-button"
                          onClick={() => handleApplyClick(team)}
                        >
                          Apply for this team
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="no-teams-message">
              <p>No available teams found. Please contact an administrator.</p>
            </div>
          )}
        </div>

        {/* Apply Confirmation Modal */}
        {showApplyModal && (
          <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Team Application</h2>
                <button className="close-button" onClick={() => setShowApplyModal(false)}>
                  &times;
                </button>
              </div>

              <div className="modal-content">
                <p>
                  Are you sure you want to apply for <strong>{selectedTeam?.name}</strong>?
                </p>
                <p>Your application will be sent to the coach for approval.</p>
              </div>

              <div className="modal-actions">
                <button className="confirm-button" onClick={handleApplyConfirm}>
                  Apply
                </button>
                <button className="reject-button" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    )
  }

  // Player Dashboard View
  return (
    <main className="main-content">
      <div className="player-dashboard">
        <div className="player-welcome">
          <div className="player-avatar">
            <span>{playerData.fname ? playerData.fname.charAt(0) : "P"}</span>
          </div>
          <div className="player-welcome-text">
            <h1>Welcome, {playerData.fname} {playerData.lname}</h1>
            <p>
              #{playerData.jerseyNum} | {playerData.position}
            </p>
          </div>
        </div>

        <div className="player-team-card">
          <div className="team-banner college"></div>
          <div className="team-content">
            <h2>{playerData.team?.teamName || "Your Team"}</h2>
            <p>{playerData.team?.description || "No team description available."}</p>
            <div className="team-meta">
              <div className="meta-item">
                <span className="meta-label">Coach:</span>
                <span className="meta-value">
                  {playerData.team?.coaches && playerData.team.coaches.length > 0
                    ? playerData.team.coaches.map(coach => `${coach.fname} ${coach.lname}`).join(", ")
                    : "No coach assigned"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Team ID:</span>
                <span className="meta-value">{playerData.team?.teamId || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="team-members-section">
          <h2>Team Members</h2>
          <div className="team-members-grid">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div className="team-member-card" key={member.id}>
                  <div className="member-avatar">
                    <span>{member.avatar}</span>
                  </div>
                  <div className="member-details">
                    <h3>{member.firstName} {member.lastName}</h3>
                    <p className="member-jersey">#{member.jerseyNumber}</p>
                    <p className="member-position">{member.position}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-members">No team members found.</div>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </main>
  )
}

export default PHome

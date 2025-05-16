"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-Home.css"

function PHome() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  
  // State to track if this is the first login
  const [isFirstLogin, setIsFirstLogin] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)


    
  // Player data state
  const [playerData, setPlayerData] = useState({
    fname: "",
    lname: "",
    email: "",
    jerseyNum: "",
    position: "",
    team: null
  })

  // Fetch player data when component mounts
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!user || !user.id) {
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
          setLoading(false);
          return;
        }
        
        setPlayerData({
          fname: data.fname || "",
          lname: data.lname || "",
          email: data.email || "",
          jerseyNum: data.jerseyNum,
          position: data.position || "Not assigned",
          team: data.team
        });
        
        // Check if player has a team
        if (data.team) {
          setIsFirstLogin(false);
        }
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [user]);


  // Available teams data
  const availableTeams = [
    {
      id: 1,
      name: "CIT-U College Team",
      description: "Our collegiate basketball team competing in university leagues and championships.",
      coach: "Michael Thompson",
    },
    {
      id: 2,
      name: "CIT-U High School Team",
      description: "Our high school basketball team developing young talents and competing in regional tournaments.",
      coach: "Sarah Johnson",
    },
    {
      id: 3,
      name: "CIT-U Elementary Team",
      description: "Our elementary school basketball program focusing on fundamentals and youth development.",
      coach: "Robert Davis",
    },
  ]

  // Static team members data
  const teamMembers = [
    { id: 101, firstName: "James", lastName: "Wilson", jerseyNumber: 23, position: "Point Guard", avatar: "J" },
    { id: 102, firstName: "Robert", lastName: "Garcia", jerseyNumber: 10, position: "Shooting Guard", avatar: "R" },
    { id: 103, firstName: "Michael", lastName: "Chen", jerseyNumber: 7, position: "Small Forward", avatar: "M" },
    { id: 104, firstName: "David", lastName: "Smith", jerseyNumber: 32, position: "Power Forward", avatar: "D" },
    { id: 105, firstName: "Christopher", lastName: "Johnson", jerseyNumber: 45, position: "Center", avatar: "C" },
  ]

  const handleApplyClick = (team) => {
    setSelectedTeam(team)
    setShowApplyModal(true)
  }

  const handleApplyConfirm = () => {
    setHasApplied(true)
    setShowApplyModal(false)
    // In a real app, you would send an API request here
  }

  // Handle approval simulation with useEffect
  useEffect(() => {
    if (!hasApplied) return;
    
    const timer = setTimeout(() => {
      setIsFirstLogin(false)
      setPlayerData(prev => ({
        ...prev,
        team: selectedTeam
      }))
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [hasApplied, selectedTeam])

  // Show loading indicator while fetching data
  if (loading) {
    return <div className="loading">Loading player data...</div>
  }

  // First login view - show available teams
  if (isFirstLogin) {
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
          <h2>Available Teams</h2>
          <div className="available-teams-grid">
            {availableTeams.map((team) => (
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
                  {hasApplied && selectedTeam?.id === team.id ? (
                    <div className="application-status pending">Waiting for coach's approval...</div>
                  ) : (
                    <button className="apply-button" onClick={() => handleApplyClick(team)} disabled={hasApplied}>
                      Apply for this team
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                  Yes, Apply
                </button>
                <button className="cancel-button" onClick={() => setShowApplyModal(false)}>
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  }

  // Regular home view after joining a team
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
            <h2>{selectedTeam?.name || playerData.team?.name}</h2>
            <p>{selectedTeam?.description || playerData.team?.description}</p>
            <div className="team-meta">
              <div className="meta-item">
                <span className="meta-label">Coach:</span>
                <span className="meta-value">{selectedTeam?.coach || playerData.team?.coach}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="team-members-section">
          <h2>Team Members</h2>
          <div className="team-members-grid">
            {teamMembers.map((member) => (
              <div className="team-member-card" key={member.id}>
                <div className="member-avatar">
                  <span>{member.avatar}</span>
                </div>
                <div className="member-details">
                  <h3>
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="member-jersey">#{member.jerseyNumber}</p>
                  <p className="member-position">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default PHome

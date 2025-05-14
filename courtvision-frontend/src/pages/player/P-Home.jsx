"use client"

import { useState, useEffect } from "react"
import "../../styles/player/P-Home.css"

function PHome() {
  // State to track if this is the first login
  const [isFirstLogin, setIsFirstLogin] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)

  // Static player data
  const playerData = {
    name: "John Doe",
    jerseyNumber: 23,
    position: "Point Guard",
    team: null, // No team initially
  }

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

  // Static team members data (shown after joining a team)
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

  // For demo purposes, let's simulate a player who has been approved
  // In a real app, this would come from your backend
  const simulateApproval = () => {
    // Simulate approval after 5 seconds for demo purposes
    setTimeout(() => {
      if (hasApplied) {
        setIsFirstLogin(false)
        playerData.team = selectedTeam
      }
    }, 5000)
  }

  useEffect(() => {
    if (hasApplied) {
      simulateApproval()
    }
  }, [hasApplied])

  // First login view - show available teams
  if (isFirstLogin) {
    return (
      <main className="main-content">
        <div className="player-welcome first-login">
          <div className="player-avatar">
            <span>{playerData.name.charAt(0)}</span>
          </div>
          <div className="player-welcome-text">
            <h1>Welcome, {playerData.name}</h1>
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
                  Are you sure you want to apply for <strong>{selectedTeam.name}</strong>?
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
            <span>{playerData.name.charAt(0)}</span>
          </div>
          <div className="player-welcome-text">
            <h1>Welcome, {playerData.name}</h1>
            <p>
              #{playerData.jerseyNumber} | {playerData.position}
            </p>
          </div>
        </div>

        <div className="player-team-card">
          <div className="team-banner college"></div>
          <div className="team-content">
            <h2>{selectedTeam?.name}</h2>
            <p>{selectedTeam?.description}</p>
            <div className="team-meta">
              <div className="meta-item">
                <span className="meta-label">Coach:</span>
                <span className="meta-value">{selectedTeam?.coach}</span>
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

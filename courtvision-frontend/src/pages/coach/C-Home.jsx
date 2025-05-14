"use client"

import { useState, useEffect } from "react"
import "../../styles/coach/C-Team.css"
import "../../styles/coach/C-Home.css"

function CHome() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "CIT-U College Team",
      description: "Our collegiate basketball team competing in university leagues and championships.",
      players: [
        { id: 101, firstName: "James", lastName: "Wilson", jerseyNumber: 23, position: "Point Guard" },
        { id: 102, firstName: "Robert", lastName: "Garcia", jerseyNumber: 10, position: "Shooting Guard" },
        { id: 103, firstName: "Michael", lastName: "Chen", jerseyNumber: 7, position: "Small Forward" },
        { id: 104, firstName: "David", lastName: "Smith", jerseyNumber: 32, position: "Power Forward" },
        { id: 105, firstName: "Christopher", lastName: "Johnson", jerseyNumber: 45, position: "Center" },
      ],
    },
    {
      id: 2,
      name: "CIT-U High School Team",
      description: "Our high school basketball team developing young talents.",
      players: [
        { id: 201, firstName: "Alex", lastName: "Williams", jerseyNumber: 4, position: "Point Guard" },
        { id: 202, firstName: "Jake", lastName: "Miller", jerseyNumber: 11, position: "Shooting Guard" },
      ],
    },
  ])

  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || null)
  const [players, setPlayers] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")

  // Get the selected team's players
  useEffect(() => {
    if (selectedTeamId) {
      const team = teams.find((t) => t.id === selectedTeamId)
      if (team) {
        setPlayers(team.players)
      }
    }
  }, [selectedTeamId, teams])

  const handleTeamChange = (e) => {
    setSelectedTeamId(Number(e.target.value))
  }

  const handleRemovePlayer = (playerId) => {
    if (window.confirm("Are you sure you want to remove this player?")) {
      // Update the players state
      setPlayers(players.filter((player) => player.id !== playerId))

      // Also update the teams state to persist the change
      setTeams(
        teams.map((team) => {
          if (team.id === selectedTeamId) {
            return {
              ...team,
              players: team.players.filter((player) => player.id !== playerId),
            }
          }
          return team
        }),
      )
    }
  }

  const handleCreateTeam = (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    // Create a new team with a unique ID
    const newTeamId = Math.max(...teams.map((t) => t.id), 0) + 1
    const newTeam = {
      id: newTeamId,
      name: newTeamName,
      description: `Team created on ${new Date().toLocaleDateString()}`,
      players: [],
    }

    // Add the new team to the teams array
    setTeams([...teams, newTeam])

    // Select the new team
    setSelectedTeamId(newTeamId)

    // Reset and close the modal
    setNewTeamName("")
    setShowCreateModal(false)
  }

  const selectedTeam = teams.find((team) => team.id === selectedTeamId) || teams[0]

  return (
    <main className="main-content">
      <div className="team-actions">
        <button className="create-team-button" onClick={() => setShowCreateModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="action-icon"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="23" y1="11" x2="17" y2="11"></line>
            <line x1="20" y1="8" x2="20" y2="14"></line>
          </svg>
          Create New Team
        </button>
      </div>

      <div className="team-selector">
        <label htmlFor="team-select">Select Team:</label>
        <select id="team-select" value={selectedTeamId || ""} onChange={handleTeamChange} className="team-select">
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div className="team-details-header">
          <div className="team-header-flex">
            <h1>{selectedTeam.name}</h1>
          </div>
          <p>{selectedTeam.description}</p>
          <div className="team-meta">
            <div className="meta-item">
              <span className="meta-label">Players:</span>
              <span className="meta-value">{players.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className="players-container">
        <div className="players-header">
          <div className="player-number-header">Jersey</div>
          <div className="player-name-header">Name</div>
          <div className="player-position-header">Position</div>
          <div className="player-action-header">Action</div>
        </div>

        {players.length > 0 ? (
          players.map((player) => (
            <div className="player-item" key={player.id}>
              <div className="player-number">#{player.jerseyNumber}</div>
              <div className="player-name">
                {player.firstName} {player.lastName}
              </div>
              <div className="player-position">{player.position}</div>
              <div className="player-action">
                <button className="remove-player-button" onClick={() => handleRemovePlayer(player.id)}>
                  Remove Player
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-players">No players found for this team.</div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Team</h2>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTeam}>
              <div className="modal-content">
                <div className="form-group">
                  <label htmlFor="team-name">Team Name</label>
                  <input
                    type="text"
                    id="team-name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="confirm-button">
                  Create Team
                </button>
                <button type="button" className="cancel-button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default CHome

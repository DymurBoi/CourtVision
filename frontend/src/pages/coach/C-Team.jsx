"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import '../../styles/coach/C-Team.css';

function CTeam() {
  const location = useLocation()
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [players, setPlayers] = useState([])
  // Get team ID from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const teamId = params.get("id")

    if (teamId) {
      const team = teams.find((t) => t.id === Number.parseInt(teamId))
      if (team) {
        setSelectedTeam(team)
        setPlayers(team.players)
      }
    } else {
      // Default to first team if no ID provided
      setSelectedTeam(teams[0])
      setPlayers(teams[0].players)
    }
  }, [location])

  const handleRemovePlayer = (playerId) => {
    if (window.confirm("Are you sure you want to remove this player?")) {
      setPlayers(players.filter((player) => player.id !== playerId))
    }
  }

  if (!selectedTeam) {
    return <div className="loading">Loading team information...</div>
  }

  return (
    <main className="main-content">
      <div className="team-details-header">
        <h1>{selectedTeam.name}</h1>
        <p>{selectedTeam.description}</p>
        <div className="team-meta">
          <div className="meta-item">
            <span className="meta-label">Coach:</span>
            <span className="meta-value">{selectedTeam.coach}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Players:</span>
            <span className="meta-value">{players.length}</span>
          </div>
        </div>
      </div>

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
    </main>
  )
}

export default CTeam
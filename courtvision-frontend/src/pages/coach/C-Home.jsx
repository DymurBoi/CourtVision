"use client"

import { useState, useEffect } from "react"
import "../../styles/coach/C-Team.css"

function CHome() {
  const [players, setPlayers] = useState([])

  // Sample team data - hardcoded to CIT-U College Team
  const team = {
    id: 1,
    name: "CIT-U College Team",
    description: "Our collegiate basketball team competing in university leagues and championships.",
    players: [
      { id: 101, firstName: "James", lastName: "Wilson", jerseyNumber: 23, position: "Point Guard" },
      { id: 102, firstName: "Robert", lastName: "Garcia", jerseyNumber: 10, position: "Shooting Guard" },
      { id: 103, firstName: "Michael", lastName: "Chen", jerseyNumber: 7, position: "Small Forward" },
      { id: 104, firstName: "David", lastName: "Smith", jerseyNumber: 32, position: "Power Forward" },
      { id: 105, firstName: "Christopher", lastName: "Johnson", jerseyNumber: 45, position: "Center" },
      { id: 106, firstName: "Daniel", lastName: "Martinez", jerseyNumber: 5, position: "Point Guard" },
      { id: 107, firstName: "Anthony", lastName: "Rodriguez", jerseyNumber: 12, position: "Shooting Guard" },
      { id: 108, firstName: "Kevin", lastName: "Brown", jerseyNumber: 21, position: "Small Forward" },
      { id: 109, firstName: "Thomas", lastName: "Davis", jerseyNumber: 33, position: "Power Forward" },
      { id: 110, firstName: "Brian", lastName: "Taylor", jerseyNumber: 50, position: "Center" },
      { id: 111, firstName: "Jason", lastName: "Anderson", jerseyNumber: 3, position: "Point Guard" },
      { id: 112, firstName: "Matthew", lastName: "Wilson", jerseyNumber: 15, position: "Shooting Guard" },
      { id: 113, firstName: "Ryan", lastName: "Thomas", jerseyNumber: 24, position: "Small Forward" },
      { id: 114, firstName: "Eric", lastName: "Lee", jerseyNumber: 42, position: "Power Forward" },
      { id: 115, firstName: "Steven", lastName: "Harris", jerseyNumber: 55, position: "Center" },
    ],
  }

  useEffect(() => {
    // Initialize players from the team data
    setPlayers(team.players)
  }, [])

  const handleRemovePlayer = (playerId) => {
    if (window.confirm("Are you sure you want to remove this player?")) {
      setPlayers(players.filter((player) => player.id !== playerId))
    }
  }

  return (
    <main className="main-content">
      <div className="team-details-header">
        <div className="team-header-flex">
          <h1>{team.name}</h1>
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

export default CHome

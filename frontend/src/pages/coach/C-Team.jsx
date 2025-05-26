"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import '../../styles/coach/C-Team.css';

function CTeam() {
  const location = useLocation()
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [players, setPlayers] = useState([])

  // Sample team data
  const teams = [
    {
      id: 1,
      name: "CIT-U College Team",
      description: "Our collegiate basketball team competing in university leagues and championships.",
      playerCount: 15,
      coach: "Michael Thompson",
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
    },
    {
      id: 2,
      name: "CIT-U High School Team",
      description: "Our high school basketball team developing young talents and competing in regional tournaments.",
      playerCount: 12,
      coach: "Sarah Johnson",
      players: [
        { id: 201, firstName: "Alex", lastName: "Williams", jerseyNumber: 4, position: "Point Guard" },
        { id: 202, firstName: "Jake", lastName: "Miller", jerseyNumber: 11, position: "Shooting Guard" },
        { id: 203, firstName: "Tyler", lastName: "Davis", jerseyNumber: 22, position: "Small Forward" },
        { id: 204, firstName: "Nathan", lastName: "Brown", jerseyNumber: 30, position: "Power Forward" },
        { id: 205, firstName: "Ethan", lastName: "Jones", jerseyNumber: 44, position: "Center" },
        { id: 206, firstName: "Brandon", lastName: "Wilson", jerseyNumber: 6, position: "Point Guard" },
        { id: 207, firstName: "Justin", lastName: "Garcia", jerseyNumber: 13, position: "Shooting Guard" },
        { id: 208, firstName: "Kyle", lastName: "Martinez", jerseyNumber: 20, position: "Small Forward" },
        { id: 209, firstName: "Connor", lastName: "Smith", jerseyNumber: 31, position: "Power Forward" },
        { id: 210, firstName: "Lucas", lastName: "Johnson", jerseyNumber: 52, position: "Center" },
        { id: 211, firstName: "Dylan", lastName: "Rodriguez", jerseyNumber: 8, position: "Point Guard" },
        { id: 212, firstName: "Joshua", lastName: "Chen", jerseyNumber: 14, position: "Shooting Guard" },
      ],
    },
    {
      id: 3,
      name: "CIT-U Elementary Team",
      description: "Our elementary school basketball program focusing on fundamentals and youth development.",
      playerCount: 10,
      coach: "Robert Davis",
      players: [
        { id: 301, firstName: "Noah", lastName: "Wilson", jerseyNumber: 2, position: "Point Guard" },
        { id: 302, firstName: "Liam", lastName: "Smith", jerseyNumber: 9, position: "Shooting Guard" },
        { id: 303, firstName: "Mason", lastName: "Johnson", jerseyNumber: 16, position: "Small Forward" },
        { id: 304, firstName: "Jacob", lastName: "Williams", jerseyNumber: 25, position: "Power Forward" },
        { id: 305, firstName: "William", lastName: "Brown", jerseyNumber: 40, position: "Center" },
        { id: 306, firstName: "Ethan", lastName: "Davis", jerseyNumber: 1, position: "Point Guard" },
        { id: 307, firstName: "Michael", lastName: "Miller", jerseyNumber: 7, position: "Shooting Guard" },
        { id: 308, firstName: "Alexander", lastName: "Garcia", jerseyNumber: 18, position: "Small Forward" },
        { id: 309, firstName: "James", lastName: "Martinez", jerseyNumber: 27, position: "Power Forward" },
        { id: 310, firstName: "Daniel", lastName: "Anderson", jerseyNumber: 35, position: "Center" },
      ],
    },
  ]

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
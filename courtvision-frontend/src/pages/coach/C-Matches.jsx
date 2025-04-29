"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import '../../styles/coach/C-Matches.css';
import CreateMatchModal from '../../components/CreateMatchModal';

// Sample match data
const matchesData = [
  {
    id: 1,
    homeTeam: "CIT-U",
    awayTeam: "USJR",
    result: "W",
    score: "78-65",
    date: "05/15/2023",
  },
  {
    id: 2,
    homeTeam: "CIT-U",
    awayTeam: "USC",
    result: "L",
    score: "62-70",
    date: "05/22/2023",
  },
  {
    id: 3,
    homeTeam: "CIT-U",
    awayTeam: "UP",
    result: "W",
    score: "85-72",
    date: "06/03/2023",
  },
  {
    id: 4,
    homeTeam: "CIT-U",
    awayTeam: "UC",
    result: "W",
    score: "90-82",
    date: "06/10/2023",
  },
  {
    id: 5,
    homeTeam: "CIT-U",
    awayTeam: "SWU",
    result: "L",
    score: "68-75",
    date: "06/17/2023",
  },
  {
    id: 6,
    homeTeam: "CIT-U",
    awayTeam: "UV",
    result: "W",
    score: "82-70",
    date: "06/24/2023",
  },
  {
    id: 7,
    homeTeam: "CIT-U",
    awayTeam: "USJR",
    result: "L",
    score: "65-72",
    date: "07/01/2023",
  },
  {
    id: 8,
    homeTeam: "CIT-U",
    awayTeam: "USC",
    result: "W",
    score: "88-80",
    date: "07/08/2023",
  },
]

function CMatches() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [matches, setMatches] = useState(matchesData)

  const handleCreateMatch = (newMatch) => {
    // Generate a new ID (in a real app, this would come from the backend)
    const newId = matches.length > 0 ? Math.max(...matches.map((match) => match.id)) + 1 : 1
    const matchWithId = { ...newMatch, id: newId }

    // Add the new match to the list
    setMatches([...matches, matchWithId])
    setShowCreateModal(false)
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Basketball Matches</h1>
        <p>View all matches and game results</p>
      </div>

      <div className="matches-actions">
        <button className="create-match-button" onClick={() => setShowCreateModal(true)}>
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Create New Match
        </button>
      </div>

      <div className="matches-container">
        <div className="matches-list">
          <div className="match-header">
            <div className="teams-header">Teams</div>
            <div className="result-header">W/L</div>
            <div className="points-header">Points</div>
            <div className="date-header">Date</div>
            <div className="action-header">Action</div>
          </div>

          {matches.map((match) => (
            <div className="match-item" key={match.id}>
              <div className="teams">
                {match.homeTeam} VS {match.awayTeam}
              </div>
              <div className={`result ${match.result === "W" ? "win" : "loss"}`}>{match.result}</div>
              <div className="points">{match.score}</div>
              <div className="date">{match.date}</div>
              <div className="match-action">
                <Link to={`/coach/game-details/${match.id}`} className="view-game-button">
                  View Game
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && <CreateMatchModal onClose={() => setShowCreateModal(false)} onSave={handleCreateMatch} />}
    </main>
  )
}

export default CMatches

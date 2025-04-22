"use client"

import { useState } from "react"
import "../styles/Matches.css"

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

function Matches() {
  const [selectedMatch, setSelectedMatch] = useState(null)

  const handleViewGame = (match) => {
    // In a real app, this would navigate to a game details page
    // For now, we'll just log the selected match
    console.log("Viewing game:", match)
    setSelectedMatch(match)
    alert(`Viewing game: ${match.homeTeam} vs ${match.awayTeam} (${match.score})`)
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Basketball Matches</h1>
        <p>View all matches and game results</p>
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

          {matchesData.map((match) => (
            <div className="match-item" key={match.id}>
              <div className="teams">
                {match.homeTeam} VS {match.awayTeam}
              </div>
              <div className={`result ${match.result === "W" ? "win" : "loss"}`}>{match.result}</div>
              <div className="points">{match.score}</div>
              <div className="date">{match.date}</div>
              <div className="match-action">
                <button className="view-game-button" onClick={() => handleViewGame(match)}>
                  View Game
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Matches


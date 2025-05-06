"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "../../styles/player/P-MatchDetails.css"

function PMatchDetails() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [activeTab, setActiveTab] = useState("team")

  // Sample match data
  const matchesData = [
    {
      id: 1,
      homeTeam: "CIT-U",
      awayTeam: "USJR",
      result: "W",
      score: "78-65",
      date: "05/15/2023",
      playerStats: {
        minutes: 32,
        points: 14,
        rebounds: 5,
        assists: 3,
        steals: 2,
        blocks: 0,
        fieldGoals: "5/9",
        threePointers: "1/3",
        freeThrows: "3/4",
        turnovers: 2,
        fouls: 3,
      },
      teamPlayers: [
        { id: 101, name: "James Wilson", points: 18, rebounds: 7, assists: 5 },
        { id: 102, name: "Robert Garcia", points: 12, rebounds: 3, assists: 2 },
        { id: 103, name: "Michael Chen", points: 16, rebounds: 8, assists: 1 },
        { id: 104, name: "David Smith", points: 10, rebounds: 6, assists: 0 },
        { id: 105, name: "Christopher Johnson", points: 8, rebounds: 4, assists: 2 },
      ],
    },
    {
      id: 2,
      homeTeam: "CIT-U",
      awayTeam: "USC",
      result: "L",
      score: "62-70",
      date: "05/22/2023",
      playerStats: {
        minutes: 28,
        points: 10,
        rebounds: 4,
        assists: 5,
        steals: 1,
        blocks: 0,
        fieldGoals: "4/10",
        threePointers: "0/2",
        freeThrows: "2/2",
        turnovers: 3,
        fouls: 2,
      },
      teamPlayers: [
        { id: 101, name: "James Wilson", points: 14, rebounds: 5, assists: 3 },
        { id: 102, name: "Robert Garcia", points: 8, rebounds: 2, assists: 4 },
        { id: 103, name: "Michael Chen", points: 12, rebounds: 6, assists: 2 },
        { id: 104, name: "David Smith", points: 9, rebounds: 8, assists: 1 },
        { id: 105, name: "Christopher Johnson", points: 9, rebounds: 3, assists: 3 },
      ],
    },
  ]

  useEffect(() => {
    // Find the match with the given ID
    const foundMatch = matchesData.find((m) => m.id === Number(id))
    if (foundMatch) {
      setMatch(foundMatch)
    }
  }, [id])

  if (!match) {
    return <div className="loading">Loading match details...</div>
  }

  return (
    <main className="main-content">
      <div className="match-details-header">
        <div className="match-title">
          <h1>
            {match.homeTeam} vs {match.awayTeam}
          </h1>
          <span className="match-date">{match.date}</span>
        </div>
        <div className="match-score">
          <span className={`match-result ${match.result === "W" ? "win" : "loss"}`}>
            {match.result === "W" ? "Win" : "Loss"}
          </span>
          <span className="score-display">{match.score}</span>
        </div>
      </div>

      <div className="stats-tabs">
        <button
          className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          My Performance
        </button>
        <button className={`tab-button ${activeTab === "team" ? "active" : ""}`} onClick={() => setActiveTab("team")}>
          Team Performance
        </button>
      </div>

      <div className="stats-content">
        {activeTab === "personal" && (
          <div className="personal-stats">
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-value">{match.playerStats.minutes}</div>
                <div className="summary-label">Minutes</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{match.playerStats.points}</div>
                <div className="summary-label">Points</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{match.playerStats.rebounds}</div>
                <div className="summary-label">Rebounds</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{match.playerStats.assists}</div>
                <div className="summary-label">Assists</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{match.playerStats.steals}</div>
                <div className="summary-label">Steals</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{match.playerStats.blocks}</div>
                <div className="summary-label">Blocks</div>
              </div>
            </div>

            <div className="detailed-stats">
              <h3>Detailed Statistics</h3>
              <div className="stats-grid">
                <div className="stat-group">
                  <div className="stat-label">Field Goals</div>
                  <div className="stat-value">{match.playerStats.fieldGoals}</div>
                </div>
                <div className="stat-group">
                  <div className="stat-label">3-Pointers</div>
                  <div className="stat-value">{match.playerStats.threePointers}</div>
                </div>
                <div className="stat-group">
                  <div className="stat-label">Free Throws</div>
                  <div className="stat-value">{match.playerStats.freeThrows}</div>
                </div>
                <div className="stat-group">
                  <div className="stat-label">Turnovers</div>
                  <div className="stat-value">{match.playerStats.turnovers}</div>
                </div>
                <div className="stat-group">
                  <div className="stat-label">Fouls</div>
                  <div className="stat-value">{match.playerStats.fouls}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="team-stats">
            <div className="team-stats-table-container">
              <table className="team-stats-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                  </tr>
                </thead>
                <tbody>
                  {match.teamPlayers.map((player) => (
                    <tr key={player.id}>
                      <td>{player.name}</td>
                      <td>{player.points}</td>
                      <td>{player.rebounds}</td>
                      <td>{player.assists}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="back-navigation">
        <Link to="/player/matches" className="back-button">
          Back to Matches
        </Link>
      </div>
    </main>
  )
}

export default PMatchDetails

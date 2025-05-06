"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../styles/player/P-Matches.css"

function PMatches() {
  const [matches, setMatches] = useState([
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
      },
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
      },
    },
    {
      id: 3,
      homeTeam: "CIT-U",
      awayTeam: "UP",
      result: "W",
      score: "85-72",
      date: "06/03/2023",
      playerStats: {
        minutes: 35,
        points: 18,
        rebounds: 6,
        assists: 4,
        steals: 3,
        blocks: 1,
      },
    },
    {
      id: 4,
      homeTeam: "CIT-U",
      awayTeam: "UC",
      result: "W",
      score: "90-82",
      date: "06/10/2023",
      playerStats: {
        minutes: 30,
        points: 12,
        rebounds: 3,
        assists: 6,
        steals: 2,
        blocks: 0,
      },
    },
  ])

  // In a real app, you would fetch matches from API
  useEffect(() => {
    // Simulating API call
    // const fetchMatches = async () => {
    //   const response = await fetch('/api/player/matches');
    //   const data = await response.json();
    //   setMatches(data);
    // }
    // fetchMatches();
  }, [])

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>My Matches</h1>
        <p>View all matches and your performance</p>
      </div>

      <div className="matches-container">
        <div className="matches-list">
          <div className="match-header">
            <div className="teams-header">Teams</div>
            <div className="result-header">W/L</div>
            <div className="points-header">Score</div>
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
                <Link to={`/player/match-details/${match.id}`} className="view-game-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default PMatches

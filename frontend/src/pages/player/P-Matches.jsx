"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-Matches.css"

function PMatches() {
  const location = useLocation();
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = new URLSearchParams(location.search);
  const teamId = params.get("teamId");


  useEffect(() => {
    const fetchPlayerTeamMatches = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (!userId) {
          setError("No player ID found. Please log in again.")
          setLoading(false)
          return
        }

        const playerId = userId.startsWith("PLAYER_") ? userId.split("_")[1] : userId

        // STEP 1: Get player details to extract teamId
        const playerRes = await api.get(`/players/get/${playerId}`)
        const player = playerRes.data
        const teamId = player.team?.teamId

        if (!teamId) {
          setError("You are not assigned to any team. Please contact your coach.")
          setLoading(false)
          return
        }

        // STEP 2: Fetch games by teamId
        const res = await api.get(`/games/get/team/${teamId}`)
        const games = res.data

        const transformed = games.map((game) => ({
          id: game.gameId,
          homeTeam: game.gameName?.split(" vs ")[0],
          awayTeam: game.gameName?.split(" vs ")[1],
          result: game.gameResult,
          score: game.finalScore,
          date: new Date(game.gameDate).toLocaleDateString(),
        }))

        setMatches(transformed)
      } catch (err) {
        console.error("Error fetching team matches:", err)
        setError("Failed to load matches. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerTeamMatches()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading matches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/player/home" className="back-button">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>My Matches</h1>
        <p>View all matches for your team</p>
      </div>

      <div className="matches-container">
        {matches.length === 0 ? (
          <div className="no-matches">
            <p>No matches found.</p>
          </div>
        ) : (
          <div className="matches-list">
            <div className="match-header">
              <div className="teams-header">Teams</div>
              <div className="result-header">W/L</div>
              <div className="score-header">Score</div>
              <div className="date-header">Date</div>
              <div className="action-header">Action</div>
            </div>
            {matches.map((match) => (
              <div className="match-item" key={match.id}>
                <div className="teams">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                <div className={`result ${match.result === "W" ? "win" : "loss"}`}>
                  {match.result}
                </div>
                <div className="score">{match.score}</div>
                <div className="date">{match.date}</div>
                <div className="actions">
                  <Link to={`/player/game-details/${match.id}?teamId=${teamId}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="back-navigation">
        <Link to="/player/home" className="back-link">
          Back to Home
        </Link>
      </div>
    </main>
  )
}

export default PMatches

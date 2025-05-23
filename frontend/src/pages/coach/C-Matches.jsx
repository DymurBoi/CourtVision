"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import '../../styles/coach/C-Matches.css';
import CreateMatchModal from '../../components/CreateMatchModal';
import gameService from '../../services/gameService';

function CMatches() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const games = await gameService.getAllGames()
      const transformedMatches = games.map(game => ({
        id: game.gameId,
        homeTeam: game.gameName.split(' vs ')[0],
        awayTeam: game.gameName.split(' vs ')[1],
        result: game.gameResult,
        score: game.finalScore,
        date: new Date(game.gameDate).toLocaleDateString()
      }))
      setMatches(transformedMatches)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching matches:', err)
      setError('Failed to load matches')
      setLoading(false)
    }
  }

  const handleCreateMatch = async (newMatch) => {
    try {
      const savedGame = await gameService.createGame(newMatch)
      
      // Transform the saved game data to match format
      const newMatchData = {
        id: savedGame.gameId,
        homeTeam: savedGame.gameName.split(' vs ')[0],
        awayTeam: savedGame.gameName.split(' vs ')[1],
        result: savedGame.gameResult,
        score: savedGame.finalScore,
        date: new Date(savedGame.gameDate).toLocaleDateString()
      }

      setMatches([...matches, newMatchData])
      setShowCreateModal(false)
    } catch (err) {
      console.error('Error creating match:', err)
      setError('Failed to create match')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading matches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchMatches} className="retry-button">
          Retry
        </button>
      </div>
    )
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

          {matches.length === 0 ? (
            <div className="no-matches">
              <p>No matches found. Create a new match to get started.</p>
            </div>
          ) : (
            matches.map((match) => (
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
            ))
          )}
        </div>
      </div>

      {showCreateModal && <CreateMatchModal onClose={() => setShowCreateModal(false)} onSave={handleCreateMatch} />}
    </main>
  )
}

export default CMatches

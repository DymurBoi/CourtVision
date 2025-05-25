"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import '../../styles/coach/C-Matches.css';
import CreateMatchModal from '../../components/CreateMatchModal';
import gameService from '../../services/gameService';

function CMatches() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coachData, setCoachData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "••••••••",
    birthDate: "",
    teamIds:[],
  });
  
  useEffect(() => {
    fetchCoachData()
    fetchMatches()
  }, [])
  
  const fetchCoachData = async () => {
  if (!user || !user.id) {
    console.log("No user data available, redirecting to login");
    navigate("/login", { replace: true });
    return;
  }

  console.log("Raw user data from AuthContext:", user);

  try {
    // Extract the numeric ID from the format "COACH_123"
    let coachId = user.id;
    let originalId = coachId; // Save for debugging

    if (typeof coachId === 'string' && coachId.startsWith("COACH_")) {
      coachId = coachId.substring(6); // Remove "COACH_" prefix
      console.log("Extracted numeric coach ID:", coachId, "from original:", originalId);
    } else {
      console.log("Using ID as-is (no prefix detected):", coachId);
    }

    // Make sure ID is a number if the backend expects it
    if (coachId && !isNaN(Number(coachId))) {
      coachId = Number(coachId);
    }

    console.log("Attempting to fetch coach profile with ID:", coachId, "Type:", typeof coachId);

    // Check authToken before making the request
    const authToken = localStorage.getItem('authToken');
    console.log("Auth token present:", authToken ? "YES" : "NO");
    if (authToken) {
      console.log("Token preview:", authToken.substring(0, 20) + "...");
    }

    // Get coach data using the api client (which adds auth headers)
    const response = await api.get(`/coaches/get/${coachId}`);
    console.log("API response status:", response.status);
    const data = response.data;

    console.log("Coach profile data received (raw):", data);

    if (!data) {
      console.error("Received empty data from API");
      setLoading(false);
      return;
    }

    // Extract the team IDs from the coach's teams
    const teamIds = data.teams ? data.teams.map((team) => team.teamId) : [];

    // Set the coach data in the state, including the list of teamIds
    setCoachData({
      firstName: data.fname || "",
      lastName: data.lname || "",
      email: data.email || "",
      password: "••••••••", // Always mask password
      birthDate: data.birthDate || "",
      teamIds: teamIds, // Store teamIds as an array
    });

    setLoading(false);
  } catch (error) {
    console.error("Error fetching coach data:", error);
    if (error.response) {
      console.error("Response error status:", error.response.status);
      console.error("Response error data:", error.response.data);
    } else if (error.request) {
      console.error("Network error - no response received");
    } else {
      console.error("Error setting up request:", error.message);
    }
    setLoading(false);
  }
};

  const fetchMatches = async () => {
    try {
      const games = await gameService.getGameByTeam(1)
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

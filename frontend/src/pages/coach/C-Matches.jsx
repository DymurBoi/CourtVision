import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-Matches.css";
import CreateMatchModal from '../../components/CreateMatchModal';
import gameService from '../../services/gameService';

function CMatches() {
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get teamId from query string
  const params = new URLSearchParams(location.search);
  const teamId = params.get("teamId");

  useEffect(() => {
    const fetchMatches = async () => {
      if (!teamId) {
        setError("No team selected. Please go back and select a team.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/games/get/team/${teamId}`);
        const games = res.data;

        const transformed = games.map((game) => ({
          id: game.gameId,
          homeTeam: game.gameName?.split(" vs ")[0],
          awayTeam: game.gameName?.split(" vs ")[1],
          result: game.gameResult,
          score: game.finalScore,
          date: new Date(game.gameDate).toLocaleDateString(),
        }));

        setMatches(transformed);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Failed to load matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [teamId]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <Link to="/coach/home" className="back-button">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleCreateMatch = async (newMatch) => {
    try {
      const savedGame = await gameService.createGame(newMatch);

      const newMatchData = {
        id: savedGame.gameId,
        homeTeam: savedGame.gameName.split(' vs ')[0],
        awayTeam: savedGame.gameName.split(' vs ')[1],
        result: savedGame.gameResult,
        score: savedGame.finalScore,
        date: new Date(savedGame.gameDate).toLocaleDateString()
      };

      setMatches([...matches, newMatchData]);
      setShowCreateModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Error creating match:', err);
      setError('Failed to create match');
    }
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Basketball Matches</h1>
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
        {matches.length === 0 ? (
          <div className="no-matches">
            <p>No matches found for this team.</p>
          </div>
        ) : (
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
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                <div className={`result ${match.result === "W" ? "win" : "loss"}`}>
                  {match.result}
                </div>
                <div className="score">{match.score}</div>
                <div className="date">{match.date}</div>
                <div className="actions">
                  <Link to={`/coach/game-details/${match.id}?teamId=${teamId}`} className="view-button">
                    View Game
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="back-navigation">
        <Link to="/coach/home" className="back-link">
          Back to Home
        </Link>
      </div>

      {showCreateModal && (
        <CreateMatchModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateMatch}
          teamId={teamId}
        />
      )}
    </main>
  );
}

export default CMatches;

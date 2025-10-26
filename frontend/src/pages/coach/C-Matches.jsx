import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-Matches.css";
import CreateMatchModal from '../../components/CreateMatchModal';
import gameService from '../../services/gameService';

function CMatches({ teamId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  // Get teamId from query string
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!teamId) {
        setError("No team selected. Please go back and select a team.");
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
          recordingType: game.recordingType,
          gameType: game.gameType,
        }));

        setMatches(transformed);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Failed to load matches. Please try again.");
      } finally {

      }
    };

    fetchMatches();
  }, [teamId]);

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

  //Handles View Game Button
  const handleViewGame = (match) => {
  if (
    match.gameType === "Practice" &&
    match.recordingType === "Live"
  ) {
    navigate(`/coach/practice-live-record/${match.id}?teamId=${teamId}`);
  } else if (
    (match.gameType === "Official Match" || match.gameType === "Scrimmage")&&
    match.recordingType === "Live"
  ) {
    navigate(`/coach/live-record/${match.id}?teamId=${teamId}`);
  } else {
    navigate(`/coach/game-details/${match.id}?teamId=${teamId}`);
  }
};



  const handleCreateMatch = (savedGame) => {
    try {
      const newMatchData = {
        id: savedGame.gameId,
        homeTeam: savedGame.gameName.split(' vs ')[0],
        awayTeam: savedGame.gameName.split(' vs ')[1],
        result: savedGame.gameResult,
        score: savedGame.finalScore,
        date: new Date(savedGame.gameDate).toLocaleDateString(),
        recordingType: savedGame.recordingType,
        gameType: savedGame.gameType,
      };

      setMatches((prev) => [...prev, newMatchData]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error handling created match:', err);
      setError('Failed to add match to list');
    }
  };



  return (
    <main className="main-content">
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
                <div
                  className={`result ${(() => {
                    if (match.recordingType === "Live") return "live";
                    if (match.result === "W") return "win";
                    if (match.result === "L") return "loss";
                    if (match.result === "T") return "tie";
                    return "";
                  })()}`}
                >
                  {match.recordingType === "Live"
                    ? "..."
                    : match.result || "-"}
                </div>
                <div className="score">{match.score}</div>
                <div className="date">{match.date}</div>
                <div className="actions">
                  <button
                    className="view-button"
                    onClick={() => handleViewGame(match)}
                  >
                    View Game
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

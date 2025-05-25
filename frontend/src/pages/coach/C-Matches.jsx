"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-Matches.css";

function CMatches() {
  const location = useLocation();
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

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>BasketBall Matches</h1>
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
                  <Link to={`/coach/game-details/${match.id}`} className="view-button">
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
    </main>
  );
}

export default CMatches;

"use client";

import { useEffect, useState } from "react";
import { api } from "../../utils/axiosConfig";
import { useAuth } from "../../components/AuthContext";
import "../../styles/coach/C-Matches.css";

function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchMatches = async () => {
      try {
        const response = await api.get("/game/get/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch matches:", error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token]);

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;

    try {
      await api.delete(`/game/delete/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMatches((prevMatches) => prevMatches.filter((m) => m.gameId !== matchId));
    } catch (error) {
      console.error("❌ Failed to delete match:", error);
      alert("Failed to delete match. Try again or check your permissions.");
    }
  };

  if (loading) {
    return <p>Loading matches...</p>;
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Basketball Matches</h1>
        <p>Manage all basketball matches</p>
      </div>

      <div className="matches-container">
        {matches.map((match) => (
          <div className="match-item" key={match.gameId}>
            <div className="teams">
              {match.homeTeamName} VS {match.awayTeamName}
            </div>
            <div className={`result ${match.result === "W" ? "win" : "loss"}`}>{match.result}</div>
            <div className="points">{match.score || `${match.homeScore}-${match.awayScore}`}</div>
            <div className="date">{match.datePlayed}</div>
            <button className="delete-button" onClick={() => handleDeleteMatch(match.gameId)}>
              Delete Match
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminMatches;

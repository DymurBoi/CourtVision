"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "../../utils/axiosConfig";
import "../../styles/admin/UserDetails.css";

function PlayerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [averages, setAverages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      setLoading(true);
      try {
        const [playerRes, averagesRes] = await Promise.all([
          api.get(`/players/get/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
          api.get(`/averages/get/by-player/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ]);

        setPlayer(playerRes.data);
        setAverages(averagesRes.data);
      } catch (error) {
        console.error("❌ Failed to fetch player or averages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [id]);

  const handleDeletePlayer = async () => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await api.delete(`/players/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        navigate("/admin/users");
      } catch (error) {
        console.error("❌ Failed to delete player:", error);
        alert("Could not delete player.");
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <main className="admin-content">
          <div className="loading">Loading player details...</div>
        </main>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="admin-layout">
        <main className="admin-content">
          <div className="not-found">Player not found.</div>
          <Link to="/admin/users" className="back-link">
            Back to User Management
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <main className="admin-content">
        <div className="user-details-header">
          <div>
            <h1>
              {player.fname} {player.lname}
            </h1>
            <span className="user-type player">player</span>
            <span className="user-status active">active</span>
          </div>
          <div className="user-actions">
            <Link to={`/admin/users/${player.playerId}/edit`} className="edit-user-button">
              Edit Player
            </Link>
            <button className="delete-user-button" onClick={handleDeletePlayer}>
              Delete Player
            </button>
          </div>
        </div>

        <div className="user-details-content">
          <div className="user-details-card">
            <h2>Basic Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">
                  {player.fname} {player.lname}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{player.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Birth Date</span>
                <span className="detail-value">{player.birthDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Jersey Number</span>
                <span className="detail-value">#{player.jerseyNum}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Position</span>
                <span className="detail-value">{player.position}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Team</span>
                <span className="detail-value">
                  {player.team?.teamName || "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          <div className="user-details-card">
            <h2>Player Averages</h2>
            {averages ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{averages.pointsPerGame.toFixed(1)}</span>
                  <span className="stat-label">Points Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{averages.assistsPerGame.toFixed(1)}</span>
                  <span className="stat-label">Assists Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{averages.reboundsPerGame.toFixed(1)}</span>
                  <span className="stat-label">Rebounds Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{averages.stealsPerGame.toFixed(1)}</span>
                  <span className="stat-label">Steals Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{averages.blocksPerGame.toFixed(1)}</span>
                  <span className="stat-label">Blocks Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{averages.minutesPerGame.toFixed(1)}</span>
                  <span className="stat-label">Minutes Per Game</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{(averages.trueShootingPercentage * 100).toFixed(1)}%</span>
                  <span className="stat-label">TS%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{(averages.usagePercentage * 100).toFixed(1)}%</span>
                  <span className="stat-label">USG%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{averages.offensiveRating.toFixed(1)}</span>
                  <span className="stat-label">Offensive Rating</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{averages.defensiveRating.toFixed(1)}</span>
                  <span className="stat-label">Defensive Rating</span>
                </div>
              </div>
            ) : (
              <p>This player has no average statistics yet.</p>
            )}
          </div>
        </div>

        <div className="back-navigation">
          <Link to="/admin/users" className="back-link">
            Back to User Management
          </Link>
        </div>
      </main>
    </div>
  );
}

export default PlayerDetails;

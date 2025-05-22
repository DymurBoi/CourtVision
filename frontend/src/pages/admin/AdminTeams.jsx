"use client";

import { useEffect, useState } from "react";
import { api } from "../../utils/axiosConfig";
import { useAuth } from "../../components/AuthContext";
import "../../styles/coach/C-Team.css";

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchTeams = async () => {
      try {
        const response = await api.get("/teams/get/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch teams:", error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, [token]);

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await api.delete(`/teams/delete/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeams((prevTeams) => prevTeams.filter((team) => team.teamId !== teamId));
    } catch (error) {
      console.error("❌ Failed to delete team:", error);
      alert("Failed to delete team. Check permissions or try again later.");
    }
  };

  if (loading) {
    return <p>Loading teams...</p>;
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Basketball Teams</h1>
        <p>Manage all basketball teams</p>
      </div>

      <div className="teams-container">
        {teams.map((team) => (
          <div className="team-card" key={team.teamId}>
            <div className="team-banner college"></div>
            <div className="team-content">
              <h2>{team.teamName}</h2>
              <p>Team ID: {team.teamId}</p>
              <div className="team-stats">
                <div className="player-count">
                  <span className="stat-label">Players:</span>
                  <span className="stat-value">{team.players?.length || 0}</span>
                </div>
                <div className="player-count">
                  <span className="stat-label">Coaches:</span>
                  <span className="stat-value">
                    {team.coaches?.map((coach) => `${coach.fname} ${coach.lname}`).join(", ") || "None"}
                  </span>
                </div>
              </div>
              <button className="team-button" onClick={() => handleDeleteTeam(team.teamId)}>
                Delete Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminTeams;

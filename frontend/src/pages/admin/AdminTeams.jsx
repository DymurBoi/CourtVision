"use client";

import { useEffect, useState } from "react";
import "../../styles/coach/C-Team.css";
import { api } from "../../utils/axiosConfig";
import { useAuth } from "../../components/AuthContext";

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/teams/get/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log("✅ Fetched teams:", response.data);
        setTeams(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Delete a team by ID
  const handleDeleteTeam = async (teamId) => {
    const confirm = window.confirm("Are you sure you want to delete this team?");
    if (!confirm) return;

    try {
      await api.delete(`/teams/delete/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Update state after successful delete
      setTeams((prev) => prev.filter((team) => team.teamId !== teamId));
      console.log(`✅ Deleted team with ID ${teamId}`);
    } catch (error) {
      console.error(`❌ Failed to delete team ${teamId}:`, error);
    }
  };

  if (loading) return <p>Loading teams...</p>;

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
              <p>{team.description}</p>
              <div className="team-stats">
                <div className="player-count">
                  <span className="stat-label">Players:</span>
                  <span className="stat-value">{team.players?.length || 0}</span>
                </div>
                <div className="player-count">
                  <span className="stat-label">Coach:</span>
                  <span className="stat-value">
                    {/* Display coach names */}
                    {team.coaches.map((coach, index) => (
                      <span key={coach.coachId}>
                        {coach.fname} {coach.lname}
                        {index < team.coaches.length - 1 && ", "}
                      </span>
                    ))}
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

"use client";

import { useState, useEffect } from "react";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-Team.css";

function AdminTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsRes = await api.get(`/teams/get/all`);
        const teamsData = teamsRes.data;

        // Fetch players and coaches for each team
        const teamsWithDetails = await Promise.all(
          teamsData.map(async (team) => {
            const [playersRes, coachesRes] = await Promise.all([
              api.get(`/players/get/by-team/${team.teamId}`),
              api.get(`/coaches/get/by-team/${team.teamId}`),
            ]);
            return {
              ...team,
              players: playersRes.data,  // Adding players info to the team
              coaches: coachesRes.data,  // Adding coaches info to the team
            };
          })
        );

        setTeams(teamsWithDetails); // Update state with teams and their players/coaches data
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams(); // Call the async function
  }, []); // Only run once on component mount

  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter((team) => team.teamId !== teamId));
    }
  };

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
                  <span className="stat-value">{team.players.length}</span>
                </div>
                <div className="player-count">
                  <span className="stat-label">Coach:</span>
                  <span className="stat-value">
                    {team.coaches.length > 0 ? team.coaches[0].fname : "No coach assigned"}
                  </span>
                </div>
              </div>
              <button
                className="save-button"
                onClick={() => handleDeleteTeam(team.teamId)}
              >
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

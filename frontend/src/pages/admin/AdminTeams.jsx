"use client";

import { useState } from "react";
import "../../styles/coach/C-Team.css";

function AdminTeams() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "CIT-U College Team",
      description: "Our collegiate basketball team competing in university leagues and championships.",
      playerCount: 15,
      coach: "Michael Thompson",
    },
    {
      id: 2,
      name: "CIT-U High School Team",
      description: "Our high school basketball team developing young talents and competing in regional tournaments.",
      playerCount: 12,
      coach: "Sarah Johnson",
    },
    {
      id: 3,
      name: "CIT-U Elementary Team",
      description: "Our elementary school basketball program focusing on fundamentals and youth development.",
      playerCount: 10,
      coach: "Robert Davis",
    },
  ]);

  const handleDeleteTeam = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter((team) => team.id !== teamId));
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
          <div className="team-card" key={team.id}>
            <div className="team-banner college"></div>
            <div className="team-content">
              <h2>{team.name}</h2>
              <p>{team.description}</p>
              <div className="team-stats">
                <div className="player-count">
                  <span className="stat-label">Players:</span>
                  <span className="stat-value">{team.playerCount}</span>
                </div>
                <div className="player-count">
                  <span className="stat-label">Coach:</span>
                  <span className="stat-value">{team.coach}</span>
                </div>
              </div>
              <button className="team-button" onClick={() => handleDeleteTeam(team.id)}>
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

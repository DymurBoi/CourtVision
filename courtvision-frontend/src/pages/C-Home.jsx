import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/C-Home.css";
 
function CHome() {
  const [teams, setTeams] = useState([]);
 
  const fetchCoachTeams = async () => {
    const coachId = localStorage.getItem("userId");
    if (!coachId) {
      alert("Coach not logged in!");
      return;
    }
 
    try {
      const response = await axios.get(`http://localhost:8080/api/teams/get/by-coach/${coachId}`);
      setTeams(response.data);
    } catch (error) {
      console.error("Failed to load coach teams:", error);
      alert("Error loading your teams. Please try again later.");
    }
  };
 
  useEffect(() => {
    fetchCoachTeams();
  }, []);
 
  // 🔘 Add New Team
  const handleAddTeam = async () => {
    const teamName = prompt("Enter new team name:");
    if (!teamName) return;
 
    const coachId = localStorage.getItem("userId");
 
    const newTeam = {
      teamName,
      coaches: [{ coachId: coachId }]
    };
 
    try {
      await axios.post("http://localhost:8080/api/teams/post", newTeam);
      alert("Team created successfully!");
      fetchCoachTeams(); // reload list
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team.");
    }
  };
 
  return (
<main className="main-content">
<div className="page-header">
<h1>My Teams</h1>
<p>Explore your basketball teams and manage your players</p>
<button onClick={handleAddTeam} className="create-team-button">
          + Create New Team
</button>
</div>
 
      <div className="teams-container">
        {teams.map((team) => (
<div className="team-card" key={team.teamId}>
<div className={`team-banner ${team.teamName.toLowerCase().includes("high") ? "highschool" :
              team.teamName.toLowerCase().includes("elementary") ? "elementary" : "college"}`}></div>
 
            <div className="team-content">
<h2>{team.teamName}</h2>
<p>Team managed by you. Includes training sessions, games, and more.</p>
<div className="team-stats">
<div className="player-count">
<span className="stat-label">Players:</span>
<span className="stat-value">{team.players?.length || 0}</span>
</div>
</div>
<Link to={`/teams?id=${team.teamId}`} className="team-button">
                View Team Details
</Link>
</div>
</div>
        ))}
 
        {teams.length === 0 && (
<p style={{ textAlign: "center", marginTop: "2rem" }}>
            No teams assigned to you yet.
</p>
        )}
</div>
</main>
  );
}
 
export default CHome;
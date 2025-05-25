"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-Team.css";
import "../../styles/coach/C-Home.css";

function CHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [coachData, setCoachData] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [players, setPlayers] = useState([]);

  // Fetch coach data + teams on load
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        console.error("No logged-in user found.");
        return;
      }

      let coachId = user.id;
      if (typeof coachId === "string" && coachId.startsWith("COACH_")) {
        coachId = coachId.substring(6);
      }

      try {
        const coachRes = await api.get(`/coaches/get/${coachId}`);
        setCoachData(coachRes.data);

        const teamRes = await api.get(`/teams/get/by-coach/${coachId}`);
        setTeams(teamRes.data);
        if (teamRes.data.length > 0) {
          setSelectedTeamId(teamRes.data[0].teamId);
        }
      } catch (err) {
        console.error("Failed to fetch coach or teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Fetch players for selected team
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!selectedTeamId) return;

      try {
        const res = await api.get(`/players/get/by-team/${selectedTeamId}`);
        setPlayers(res.data);
      } catch (err) {
        console.error("Failed to fetch players:", err);
        setPlayers([]);
      }
    };

    fetchPlayers();
  }, [selectedTeamId]);

  const handleTeamChange = (e) => {
    setSelectedTeamId(Number(e.target.value));
  };

  const handleViewMatches = () => {
  navigate(`/coach/matches?teamId=${selectedTeamId}`);
};

  if (loading) {
    return <div className="loading">Loading coach dashboard...</div>;
  }

  return (
    <main className="main-content">
      <div className="coach-welcome">
        <div className="coach-avatar">
          <span>{coachData?.fname ? coachData.fname.charAt(0) : "C"}</span>
        </div>
        <div className="coach-welcome-text">
          <h1>
            Welcome, Coach {coachData?.fname} {coachData?.lname}
          </h1>
        </div>
      </div>

      <div className="team-selector">
        <label htmlFor="team-select">Select Team:</label>
        <select
          id="team-select"
          value={selectedTeamId || ""}
          onChange={handleTeamChange}
          className="team-select"
        >
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

      <div className="team-actions">
        <button className="view-matches-button" onClick={handleViewMatches}>
          View Matches
        </button>
      </div>

      {selectedTeamId && (
        <div className="team-details-header">
          <h2>
            {teams.find((t) => t.teamId === selectedTeamId)?.teamName || "Team"}
          </h2>
          <p>
            Players: {players.length}
          </p>
        </div>
      )}

      <div className="players-container">
        <div className="players-header">
          <div className="player-number-header">Jersey</div>
          <div className="player-name-header">Name</div>
          <div className="player-position-header">Position</div>
        </div>

        {players.length > 0 ? (
          players.map((player) => (
            <div className="player-item" key={player.playerId}>
              <div className="player-number">#{player.jerseyNum}</div>
              <div className="player-name">
                {player.fname} {player.lname}
              </div>
              <div className="player-position">{player.position || "N/A"}</div>
            </div>
          ))
        ) : (
          <div className="no-players">No players in this team.</div>
        )}
      </div>
    </main>
  );
}

export default CHome;

import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-PlayerRanking.css";

const POSITIONS = [
  { key: "point-guards", label: "Point Guard" },
  { key: "shooting-guards", label: "Shooting Guard" },
  { key: "small-forwards", label: "Small Forward" },
  { key: "power-forwards", label: "Power Forward" },
  { key: "centers", label: "Center" },
];

function CPlayerRanking() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [activePosition, setActivePosition] = useState(POSITIONS[0].key);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch teams for the logged-in coach
  useEffect(() => {
    if (user && user.id) {
      let coachId = user.id;
      if (typeof coachId === "string" && coachId.startsWith("COACH_")) {
        coachId = coachId.substring(6);
      }
      fetchTeams(coachId);
    }
  }, [user]);

  const fetchTeams = async (coachId) => {
    try {
      const res = await api.get(`/teams/get/by-coach/${coachId}`);
      const teamList = res.data || [];
      setTeams(teamList);
      if (teamList.length > 0) setSelectedTeamId(teamList[0].teamId);
    } catch (err) {
      setTeams([]);
    }
  };

  // Fetch rankings whenever team or position changes
  useEffect(() => {
    if (selectedTeamId) {
      fetchRankings(selectedTeamId, activePosition);
    }
    // eslint-disable-next-line
  }, [selectedTeamId, activePosition]);

  const fetchRankings = async (teamId, positionKey) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/averages/rank/${positionKey}/${teamId}`);
      setRankings(res.data || []);
    } catch (err) {
      setError("Failed to fetch rankings.");
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stats-container">
      <h1 className="page-title">Player Rankings</h1>
      <p className="page-subtitle">View player rankings by basketball position</p>

      {/* ===== TEAM SELECTOR ===== */}
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <label htmlFor="team-select" style={{ fontWeight: 600, marginRight: 8 }}>
          Select Team:
        </label>
        <select
          id="team-select"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
        >
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

      {/* ===== POSITION TABS (Scrollable on Mobile) ===== */}
      <div className="positions-tabs">
        {POSITIONS.map((pos) => (
          <button
            key={pos.key}
            className={`tab-button ${activePosition === pos.key ? "active" : ""}`}
            onClick={() => setActivePosition(pos.key)}
          >
            {pos.label}
          </button>
        ))}
      </div>

      {/* ===== RANKINGS TABLE ===== */}
      {loading ? (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <div className="loading-spinner" style={{ marginBottom: 12 }} />
          <span>Loading rankings...</span>
        </div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      ) : (
        <div className="stats-table-container">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Position</th>
                <th>Points</th>
                <th>Assists</th>
                <th>Rebounds</th>
                <th>Blocks</th>
              </tr>
            </thead>
            <tbody>
              {rankings.length > 0 ? (
                rankings.map((player, idx) => {
                  const name = player.player
                    ? `${player.player.fname} ${player.player.lname}`
                    : player.playerName || "-";
                  const position = player.player
                    ? player.player.position
                    : player.position || "-";
                  const points = player.pointsPerGame ?? player.averagePoints;
                  const assists = player.assistsPerGame ?? player.averageAssists;
                  const rebounds = player.reboundsPerGame ?? player.averageRebounds;
                  const blocks = player.blocksPerGame ?? player.averageBlocks;

                  return (
                    <tr
                      key={player.player?.playerId || player.playerId || idx}
                    >
                      <td>{idx + 1}</td>
                      <td>{name}</td>
                      <td>{position}</td>
                      <td>{points?.toFixed(1) ?? "-"}</td>
                      <td>{assists?.toFixed(1) ?? "-"}</td>
                      <td>{rebounds?.toFixed(1) ?? "-"}</td>
                      <td>{blocks?.toFixed(1) ?? "-"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    No player rankings available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CPlayerRanking;

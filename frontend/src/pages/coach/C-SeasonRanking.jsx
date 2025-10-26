import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import "../../styles/coach/C-SeasonRanking.css"; // ✅ Follows the CSS provided

const POSITIONS = [
  { key: "point-guards", label: "Point Guard" },
  { key: "shooting-guards", label: "Shooting Guard" },
  { key: "small-forwards", label: "Small Forward" },
  { key: "power-forwards", label: "Power Forward" },
  { key: "centers", label: "Center" },
];

function CSeasonRanking() {
  const { id: seasonId } = useParams();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [activePosition, setActivePosition] = useState(POSITIONS[0].key);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch teams by coach ID
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
      setTeams(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedTeamId(res.data[0].teamId);
      }
    } catch {
      setTeams([]);
    }
  };

  // Fetch rankings based on team + position + season
  useEffect(() => {
    if (selectedTeamId) fetchRankings(selectedTeamId, activePosition);
    // eslint-disable-next-line
  }, [selectedTeamId, activePosition, seasonId]);

  const fetchRankings = async (teamId, positionKey) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/averages/season/rank/${positionKey}/${teamId}/${seasonId}`
      );
      setRankings(res.data || []);
    } catch {
      setError("Failed to fetch seasonal rankings.");
      setRankings([]);
    }
    setLoading(false);
  };

  return (
    <div className="stats-container">
      {/* Title Section */}
      <h1 className="page-title">Season Player Rankings</h1>
      <p className="page-subtitle">Season: {seasonId}</p>

      {/* Team Selector */}
      <div className="team-select-wrapper">
        <label htmlFor="team-select">Select Team:</label>
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

      {/* Position Tabs */}
      <div className="position-tabs">
        {POSITIONS.map((pos) => (
          <button
            key={pos.key}
            className={`tab-button${activePosition === pos.key ? " active" : ""}`}
            onClick={() => setActivePosition(pos.key)}
          >
            {pos.label}
          </button>
        ))}
      </div>

      {/* Rankings Table */}
      {loading ? (
        <div className="loading-section">
          <div className="loading-spinner" />
          <span>Loading rankings...</span>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="stats-card">
          <div className="stats-card-header">
            <h2>
              {POSITIONS.find((p) => p.key === activePosition)?.label} Rankings
            </h2>
          </div>
          <div className="stats-table-wrapper">
            {rankings.length === 0 ? (
              <div className="empty-message">
                No players found for this position in this season.
              </div>
            ) : (
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
                  {rankings.map((player, idx) => {
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
                      <tr key={player.player?.playerId || player.playerId || idx}>
                        <td>{idx + 1}</td>
                        <td>{name}</td>
                        <td>{position}</td>
                        <td>{points?.toFixed(1) ?? "-"}</td>
                        <td>{assists?.toFixed(1) ?? "-"}</td>
                        <td>{rebounds?.toFixed(1) ?? "-"}</td>
                        <td>{blocks?.toFixed(1) ?? "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CSeasonRanking;

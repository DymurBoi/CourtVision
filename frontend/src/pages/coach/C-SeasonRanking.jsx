import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { api } from "../../utils/axiosConfig";
import "../../styles/player/P-Stats.css";

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
    } catch (err) {
      setTeams([]);
    }
  };

  useEffect(() => {
    if (selectedTeamId) fetchRankings(selectedTeamId, activePosition);
    // eslint-disable-next-line
  }, [selectedTeamId, activePosition, seasonId]);

  const fetchRankings = async (teamId, positionKey) => {
    setLoading(true);
    setError("");
    try {
      // map positionKey to endpoint path component
      const endpointMap = {
        "point-guards": "point-guards",
        "shooting-guards": "shooting-guards",
        "small-forwards": "small-forwards",
        "power-forwards": "power-forwards",
        "centers": "centers",
      };
      const pos = endpointMap[positionKey];
      const res = await api.get(`/averages/season/rank/${pos}/${teamId}/${seasonId}`);
      setRankings(res.data || []);
    } catch (err) {
      setError("Failed to fetch seasonal rankings.");
      setRankings([]);
    }
    setLoading(false);
  };

  return (
    <div className="stats-container">
      <h1 className="page-title">Season Player Rankings</h1>
      <p className="page-subtitle">Season: {seasonId}</p>
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="team-select">Select Team: </label>
        <select
          id="team-select"
          value={selectedTeamId}
          onChange={e => setSelectedTeamId(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', marginRight: 8 }}
        >
          {teams.map(team => (
            <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {POSITIONS.map(pos => (
          <button
            key={pos.key}
            className={`tab-button${activePosition === pos.key ? ' active' : ''}`}
            style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: activePosition === pos.key ? 'var(--medium-purple)' : 'var(--light-purple)', color: activePosition === pos.key ? 'white' : 'var(--dark-blue)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setActivePosition(pos.key)}
          >
            {pos.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div className="loading-spinner" style={{ marginBottom: 12 }} />
          <span>Loading rankings...</span>
        </div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div className="stats-card">
          <div className="stats-card-header">
            <h2>{POSITIONS.find(p => p.key === activePosition)?.label} Rankings (Season)</h2>
          </div>
          <div style={{ padding: 24, overflowX: 'auto' }}>
            {rankings.length === 0 ? (
              <div>No players found for this position in this season.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: 'var(--light-purple)' }}>
                    <th style={{ padding: 8 }}>Rank</th>
                    <th style={{ padding: 8 }}>Name</th>
                    <th style={{ padding: 8 }}>Position</th>
                    <th style={{ padding: 8 }}>Points</th>
                    <th style={{ padding: 8 }}>Assists</th>
                    <th style={{ padding: 8 }}>Rebounds</th>
                    <th style={{ padding: 8 }}>Blocks</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((player, idx) => {
                    const name = player.player ? `${player.player.fname} ${player.player.lname}` : player.playerName || "-";
                    const position = player.player ? player.player.position : player.position || "-";
                    const points = player.pointsPerGame ?? player.averagePoints;
                    const assists = player.assistsPerGame ?? player.averageAssists;
                    const rebounds = player.reboundsPerGame ?? player.averageRebounds;
                    const blocks = player.blocksPerGame ?? player.averageBlocks;
                    const rowStyle = idx === 0 ? { background: 'rgba(123,123,243,0.08)', fontWeight: 700 } : {};
                    return (
                      <tr key={player.player?.playerId || player.playerId || idx} style={{ borderBottom: '1px solid #eee', ...rowStyle, textAlign: 'center' }}>
                        <td style={{ padding: 16 }}>{idx + 1}</td>
                        <td style={{ padding: 16 }}>{name}</td>
                        <td style={{ padding: 16 }}>{position}</td>
                        <td style={{ padding: 16 }}>{points?.toFixed(1) ?? '-'}</td>
                        <td style={{ padding: 16 }}>{assists?.toFixed(1) ?? '-'}</td>
                        <td style={{ padding: 16 }}>{rebounds?.toFixed(1) ?? '-'}</td>
                        <td style={{ padding: 16 }}>{blocks?.toFixed(1) ?? '-'}</td>
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

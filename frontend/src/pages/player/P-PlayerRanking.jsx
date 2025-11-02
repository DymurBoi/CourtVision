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

function PPlayerRanking() {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [activePosition, setActivePosition] = useState(POSITIONS[0].key);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch player's team
  useEffect(() => {
    const fetchPlayerTeam = async () => {
      if (!user || !user.id) return;

      let playerId = user.id;
      if (typeof playerId === "string" && playerId.startsWith("PLAYER_")) {
        playerId = playerId.substring(7);
      }

      try {
        const res = await api.get(`/players/get/${playerId}`);
        const player = res.data;
        if (player && player.team) {
          setTeam(player.team);
        } else {
          setError("You are not currently assigned to any team.");
        }
      } catch (err) {
        console.error("Error fetching player team:", err);
        setError("Failed to fetch player data.");
      }
    };

    fetchPlayerTeam();
  }, [user]);

  // ✅ Fetch rankings for player's team
  useEffect(() => {
    const fetchRankings = async () => {
      if (!team || !team.teamId) return;

      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/averages/rank/${activePosition}/${team.teamId}`);
        setRankings(res.data || []);
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError("Failed to fetch player rankings.");
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [team, activePosition]);

  return (
    <div className="stats-container">
      <h1 className="page-title">Player Rankings</h1>
      {team ? (
        <>
          <p className="page-subtitle">
            Viewing rankings for <strong>{team.teamName}</strong>
          </p>

          {/* ===== POSITION TABS ===== */}
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
                          key={player.player?.playerId || idx}
                          style={{
                            fontWeight: idx === 0 ? 700 : "normal",
                            background: idx === 0 ? "rgba(123,123,243,0.08)" : "transparent",
                          }}
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
        </>
      ) : (
        <div style={{ color: "gray", textAlign: "center", marginTop: "2rem" }}>
          {error || "You are not assigned to a team yet."}
        </div>
      )}
    </div>
  );
}

export default PPlayerRanking;

import { useState, useEffect } from "react";
import { api } from "../utils/axiosConfig"; // use your secured axios instance
import "../styles/Modal.css";
import "../styles/MatchModal.css";

function CreateMatchModal({ onClose, onSave, teamId }) {
  const [formData, setFormData] = useState({
    homeTeam: "CIT-U",
    awayTeam: "",
    gameDate: new Date().toISOString().split("T")[0],
    gameResult: "W",
    finalScore: "",
    players: [],
  });

  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  // Fetch players when teamId changes
  useEffect(() => {
    if (teamId) {
      fetchPlayers(teamId);
    }
  }, [teamId]);

  const fetchPlayers = async (teamId) => {
    setLoadingPlayers(true);
    try {
      const response = await api.get(`/players/get/by-team/${teamId}`);
      setPlayers(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch players:", error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlayerChange = (index, field, value) => {
    const updated = [...formData.players];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      players: updated,
    }));
  };

  const addPlayer = () => {
    setFormData((prev) => ({
      ...prev,
      players: [
        ...prev.players,
        {
          playerId: "",
          twoPtAttempts: 0,
          twoPtMade: 0,
          threePtAttempts: 0,
          threePtMade: 0,
          ftAttempts: 0,
          ftMade: 0,
          assists: 0,
          oFRebounds: 0,
          dFRebounds: 0,
          blocks: 0,
          steals: 0,
          turnovers: 0,
          pFouls: 0,
          dFouls: 0,
          plusMinus: 0, // will be calculated on the backend
          minutes: "00:00:00",
        },
      ],
    }));
  };

  const removePlayer = (index) => {
    const updated = [...formData.players];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      players: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Create the game
      const gamePayload = {
        gameName: `${formData.homeTeam} vs ${formData.awayTeam}`,
        gameResult: formData.gameResult,
        finalScore: formData.finalScore,
        gameDate: formData.gameDate,
        team: { teamId: teamId },
      };

      const gameRes = await api.post("/games/post", gamePayload);
      const savedGame = gameRes.data;
      console.log("✅ Game created:", savedGame);

      const gameId = savedGame.gameId;

      // 2️⃣ Create basic stats for each player
      for (const player of formData.players) {
        const basicStatsPayload = {
          twoPtAttempts: Number(player.twoPtAttempts),
          twoPtMade: Number(player.twoPtMade),
          threePtAttempts: Number(player.threePtAttempts),
          threePtMade: Number(player.threePtMade),
          ftAttempts: Number(player.ftAttempts),
          ftMade: Number(player.ftMade),
          assists: Number(player.assists),
          oFRebounds: Number(player.oFRebounds),
          dFRebounds: Number(player.dFRebounds),
          blocks: Number(player.blocks),
          steals: Number(player.steals),
          turnovers: Number(player.turnovers),
          pFouls: Number(player.pFouls),
          dFouls: Number(player.dFouls),
          plusMinus: 0, // will be recalculated by backend
          minutes: player.minutes,
          player: { playerId: player.playerId },
          game: { gameId: gameId },
        };

        const statsRes = await api.post("/basic-stats/post", basicStatsPayload);
        console.log(`✅ Basic stats saved for player ${player.playerId}:`, statsRes.data);
      }

      alert("✅ Match and player stats saved successfully!");
      onSave(); // trigger parent refresh
      onClose();
    } catch (error) {
      console.error("❌ Failed to save match or stats:", error);
      alert("Failed to save match. Check console for details.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Match</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="match-form-section">
              <h3>Match Details</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleChange}
                  placeholder="Home Team"
                  required
                  style={{ width: "150px" }}
                />
                <input
                  type="text"
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleChange}
                  placeholder="Away Team"
                  required
                  style={{ width: "150px" }}
                />
                <input
                  type="text"
                  name="finalScore"
                  value={formData.finalScore}
                  onChange={handleChange}
                  placeholder="Score (e.g. 78-65)"
                  required
                  style={{ width: "100px" }}
                />
              </div>
              <div className="form-row">
                <select
                  name="gameResult"
                  value={formData.gameResult}
                  onChange={handleChange}
                  style={{ width: "100px" }}
                >
                  <option value="W">Win</option>
                  <option value="L">Loss</option>
                </select>
                <input
                  type="date"
                  name="gameDate"
                  value={formData.gameDate}
                  onChange={handleChange}
                  required
                  style={{ width: "150px" }}
                />
              </div>
            </div>

            <div className="match-form-section">
              <div className="section-header">
                <h3>Player Statistics</h3>
                <button type="button" onClick={addPlayer}>
                  + Add Player
                </button>
              </div>

              <div className="players-table-container">
                <table className="players-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>MIN</th>
                      <th>2PTA</th>
                      <th>2PTM</th>
                      <th>3PTA</th>
                      <th>3PTM</th>
                      <th>FTA</th>
                      <th>FTM</th>
                      <th>AST</th>
                      <th>OREB</th>
                      <th>DREB</th>
                      <th>BLK</th>
                      <th>STL</th>
                      <th>TO</th>
                      <th>PF</th>
                      <th>DF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.players.map((player, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            value={player.playerId}
                            onChange={(e) => handlePlayerChange(index, "playerId", e.target.value)}
                            required
                            style={{ width: "120px" }}
                          >
                            <option value="">Select Player</option>
                            {players.map((p) => (
                              <option key={p.playerId} value={p.playerId}>
                                {p.fname} {p.lname}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={player.minutes}
                            onChange={(e) => handlePlayerChange(index, "minutes", e.target.value)}
                            placeholder="00:20:00"
                            style={{ width: "90px" }}
                          />
                        </td>
                        {["twoPtAttempts", "twoPtMade", "threePtAttempts", "threePtMade", "ftAttempts", "ftMade", "assists", "oFRebounds", "dFRebounds", "blocks", "steals", "turnovers", "pFouls", "dFouls"].map((field) => (
                          <td key={field}>
                            <input
                              type="number"
                              value={player[field]}
                              onChange={(e) => handlePlayerChange(index, field, e.target.value)}
                              style={{ width: "60px" }}
                            />
                          </td>
                        ))}
                        <td>
                          <button type="button" onClick={() => removePlayer(index)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;

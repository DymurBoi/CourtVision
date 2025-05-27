import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/axiosConfig";
import '../../styles/coach/C-GameDetails.css';

function CGameDetails() {
  const { id: gameId } = useParams();
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("teamId");

  const [players, setPlayers] = useState([]);
  const [basicStats,setBasicStats] = useState([]);
  const [basicStatsInputs, setBasicStatsInputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (!teamId) {
        setError("No team ID provided. Cannot load players.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/players/get/by-team/${teamId}`);
        setPlayers(res.data);
      } catch (err) {
        console.error("❌ Failed to load team players:", err);
        setError("Failed to load team players.");
      } finally {
        setLoading(false);
      }
    };
    const fetchBasicStats = async () => {
      try {
        const res = await api.get(`/basic-stats/get/by-game/${gameId}`);
        setBasicStats(res.data);
      } catch (err) {
        console.error("❌ Failed to load basic stats:", err);
        setError("Failed to load basic stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchBasicStats();
    fetchTeamPlayers();
  }, [teamId]);

  const handleStatChange = (playerId, field, value) => {
    setBasicStatsInputs((prev) =>
      prev.map((input) =>
        input.playerId === playerId ? { ...input, [field]: value } : input
      )
    );
  };

  // Add a new row for the selected player
  const handleAddRow = () => {
    if (!selectedPlayerId) return;
    const player = players.find((p) => p.playerId === selectedPlayerId);
    if (!player) return;
    setBasicStatsInputs((prev) => [
      ...prev,
      {
        playerId: player.playerId,
        fname: player.fname,
        lname: player.lname,
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
        plusMinus: 0,
        minutes: "00:00:00",
        saved: false,
        editable: true,
        basicStatId: null, // for PUT after POST
      },
    ]);
    setShowAddRow(false);
    setSelectedPlayerId("");
  };

  // POST to create new BasicStats
  const handleCreateStats = async (playerStat) => {
    setSaving(true);
    try {
      const payload = {
        ...playerStat,
        twoPtAttempts: Number(playerStat.twoPtAttempts),
        twoPtMade: Number(playerStat.twoPtMade),
        threePtAttempts: Number(playerStat.threePtAttempts),
        threePtMade: Number(playerStat.threePtMade),
        ftAttempts: Number(playerStat.ftAttempts),
        ftMade: Number(playerStat.ftMade),
        assists: Number(playerStat.assists),
        oFRebounds: Number(playerStat.oFRebounds),
        dFRebounds: Number(playerStat.dFRebounds),
        blocks: Number(playerStat.blocks),
        steals: Number(playerStat.steals),
        turnovers: Number(playerStat.turnovers),
        pFouls: Number(playerStat.pFouls),
        dFouls: Number(playerStat.dFouls),
        plusMinus: 0,
        minutes: playerStat.minutes,
        player: { playerId: playerStat.playerId },
        game: { gameId: Number(gameId) },
      };

      const response = await api.post("/basic-stats/post", payload);
      const returned = response.data;

      setBasicStatsInputs((prev) =>
        prev.map((input) =>
          input.playerId === playerStat.playerId
            ? {
                ...input,
                saved: true,
                editable: false,
                basicStatId: returned.basicStatId,
              }
            : input
        )
      );
      alert(`✅ Stats created for player ${playerStat.playerId}`);
    } catch (error) {
      console.error("❌ Failed to create basic stats:", error);
      alert(`❌ Failed to create stats for player ${playerStat.playerId}`);
    } finally {
      setSaving(false);
    }
  };

  // PUT to update BasicStats
  const handleSaveStats = async (playerStat) => {
    setSaving(true);
    try {
      const payload = {
        ...playerStat,
        twoPtAttempts: Number(playerStat.twoPtAttempts),
        twoPtMade: Number(playerStat.twoPtMade),
        threePtAttempts: Number(playerStat.threePtAttempts),
        threePtMade: Number(playerStat.threePtMade),
        ftAttempts: Number(playerStat.ftAttempts),
        ftMade: Number(playerStat.ftMade),
        assists: Number(playerStat.assists),
        oFRebounds: Number(playerStat.oFRebounds),
        dFRebounds: Number(playerStat.dFRebounds),
        blocks: Number(playerStat.blocks),
        steals: Number(playerStat.steals),
        turnovers: Number(playerStat.turnovers),
        pFouls: Number(playerStat.pFouls),
        dFouls: Number(playerStat.dFouls),
        plusMinus: 0,
        minutes: playerStat.minutes,
        player: { playerId: playerStat.playerId },
        game: { gameId: Number(gameId) },
      };

      const response = await api.put(`/basic-stats/put/${playerStat.basicStatId}`, payload);
      const returned = response.data;

      setBasicStatsInputs((prev) =>
        prev.map((input) =>
          input.playerId === playerStat.playerId
            ? {
                ...input,
                saved: true,
                editable: false,
                basicStatId: returned.basicStatId,
              }
            : input
        )
      );
      alert(`✅ Stats updated for player ${playerStat.playerId}`);
    } catch (error) {
      console.error("❌ Failed to update basic stats:", error);
      alert(`❌ Failed to update stats for player ${playerStat.playerId}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEdit = (playerId) => {
    setBasicStatsInputs((prev) =>
      prev.map((input) =>
        input.playerId === playerId
          ? { ...input, editable: !input.editable }
          : input
      )
    );
  };

  // Players not yet added to the table
  const availablePlayers = players.filter(
    (p) => !basicStatsInputs.some((stat) => stat.playerId === p.playerId)
  );

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <main className="main-content">
      <h1>Game Details — Game ID: {gameId}</h1>
      <h2>Team ID: {teamId}</h2>
      

      <div className="players-table-container">
        <table className="players-table">
          <thead>
            <tr>
              <th>Player Name</th>
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
              <th>Action</th>
            </tr>
            {showAddRow && (
              <tr>
                <td colSpan={17}>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      handleAddRow();
                    }}
                    style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
                  >
                    <select
                      value={selectedPlayerId}
                      onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                      required
                    >
                      <option value="">Select Player</option>
                      {availablePlayers.map((player) => (
                        <option key={player.playerId} value={player.playerId}>
                          {player.fname} {player.lname}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="MIN"
                      value={"00:00:00"}
                      disabled
                      style={{ width: "80px" }}
                    />
                    {[
                      "twoPtAttempts",
                      "twoPtMade",
                      "threePtAttempts",
                      "threePtMade",
                      "ftAttempts",
                      "ftMade",
                      "assists",
                      "oFRebounds",
                      "dFRebounds",
                      "blocks",
                      "steals",
                      "turnovers",
                      "pFouls",
                      "dFouls",
                    ].map((field) => (
                      <input
                        key={field}
                        type="number"
                        value={0}
                        disabled
                        style={{ width: "60px" }}
                        placeholder={field}
                      />
                    ))}
                    <button
                      type="submit"
                      disabled={!selectedPlayerId}
                      className="save-button"
                    >
                      Add
                    </button>
                  </form>
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={17}>
                <button
                  onClick={() => setShowAddRow((prev) => !prev)}
                  disabled={availablePlayers.length === 0}
                >
                  Add Row
                </button>
              </td>
            </tr>
          </thead>
          <tbody>
            {basicStatsInputs.map((playerStat) => (
              <tr key={playerStat.playerId}>
                <td>
                  {playerStat.fname} {playerStat.lname}
                </td>
                <td>
                  <input
                    type="text"
                    value={playerStat.minutes}
                    onChange={(e) =>
                      handleStatChange(playerStat.playerId, "minutes", e.target.value)
                    }
                    style={{ width: "80px" }}
                    readOnly={!playerStat.editable}
                  />
                </td>
                {[
                  "twoPtAttempts",
                  "twoPtMade",
                  "threePtAttempts",
                  "threePtMade",
                  "ftAttempts",
                  "ftMade",
                  "assists",
                  "oFRebounds",
                  "dFRebounds",
                  "blocks",
                  "steals",
                  "turnovers",
                  "pFouls",
                  "dFouls",
                ].map((field) => (
                  <td key={field}>
                    <input
                      type="number"
                      value={playerStat[field]}
                      onChange={(e) =>
                        handleStatChange(playerStat.playerId, field, e.target.value)
                      }
                      style={{ width: "60px" }}
                      readOnly={!playerStat.editable}
                    />
                  </td>
                ))}
                <td>
                  {!playerStat.saved ? (
                    // Only show Save (POST) button for new rows
                    <button
                      onClick={() => handleCreateStats(playerStat)}
                      disabled={saving}
                      className="save-button"
                    >
                      Save
                    </button>
                  ) : playerStat.editable ? (
                    // Show Save (PUT) button when editing
                    <button
                      onClick={() => handleSaveStats(playerStat)}
                      disabled={saving}
                      className="save-button"
                    >
                      Save
                    </button>
                  ) : (
                    // Show Edit button when not editing
                    <button
                      onClick={() => handleToggleEdit(playerStat.playerId)}
                      disabled={saving}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>MIN</th>
                  <th>2 PTS M/A</th>
                  <th>3 PTS M/A</th>
                  <th>FT M/A</th>
                  <th>STL</th>
                  <th>TO</th>
                  <th>AST</th>
                  <th>BLK</th>
                  <th>OREB</th>
                  <th>DREB</th>
                  <th>FOULS PF/FD</th>
                </tr>
              </thead>
              <tbody>
                {basicStats.map((playerStat) => (
                  <tr key={playerStat.basicStatId}>
                    <td>{playerStat.playerName}</td>
                    <td>{playerStat.minutes}</td>
                    <td>{playerStat.twoPtMade}/{playerStat.twoPtAttempts}</td>
                    <td>{playerStat.threePtMade}/{playerStat.threePtAttempts}</td>
                    <td>{playerStat.ftMade}/{playerStat.ftAttempts}</td>
                    <td>{playerStat.steals}</td>
                    <td>{playerStat.turnovers}</td>
                    <td>{playerStat.assists}</td>
                    <td>{playerStat.blocks}</td>
                    <td>{playerStat.oFRebounds}</td>
                    <td>{playerStat.dFRebounds}</td>
                    <td>{playerStat.pFouls}/{playerStat.dFouls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </main>
  );
}

export default CGameDetails;
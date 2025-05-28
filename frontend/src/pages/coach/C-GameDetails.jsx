import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/axiosConfig";
import '../../styles/coach/C-GameDetails.css';
import EditIcon from '@mui/icons-material/Edit';
import BasicStatsEditModal from "../../components/BasicStatsEditModal";

function CGameDetails() {

  const { id: gameId } = useParams();
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("teamId");

  const [players, setPlayers] = useState([]);
  const [gameDetails, setGameDetails] = useState();
  const [basicStats,setBasicStats] = useState([]);
  const [advancedStats, setAdvancedStats] = useState([]);
  const [physicalMetrics, setPhysicalMetrics] = useState([]);
  const [basicStatsInputs, setBasicStatsInputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [activeTab, setActiveTab] = useState("basic")
  const [hasFetchedStats, setHasFetchedStats] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [selectedStat, setSelectedStat] = useState(null);
useEffect(() => {
  const fetchEverything = async () => {
    if (!teamId || !gameId) {
      setError("Missing IDs");
      setLoading(false);
      return;
    }

    try {
      const gameRes = await api.get(`/games/get/${gameId}`);
      setGameDetails(gameRes.data);

      await api.get(`/players/get/by-team/${teamId}`).then(res => setPlayers(res.data));

      if (gameRes.data.basicStatIds?.length > 0 && !hasFetchedStats) {
        await Promise.all([
          api.get(`/basic-stats/get/by-game/${gameId}`).then(res => setBasicStats(res.data)),
          api.get(`/advanced-stats/get/by-game/${gameId}`).then(res => setAdvancedStats(res.data)),
          api.get(`/physical-metrics/get/by-game/${gameId}`).then(res => setPhysicalMetrics(res.data)),
        ]);
        setHasFetchedStats(true);
      }
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  fetchEverything();
}, [gameId, teamId]);
 // Add gameDetails as a dependency to trigger effect after it's set

 

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
    window.location.reload();
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

  const toggleBasicStatEdit = (index) => {
  setBasicStats((prev) =>
    prev.map((stat, i) =>
      i === index ? { ...stat, editable: !stat.editable } : stat
    )
  );
};

const updateBasicStat = (index, field, value) => {
  setBasicStats((prev) =>
    prev.map((stat, i) =>
      i === index ? { ...stat, [field]: value } : stat
    )
  );
};

const saveBasicStat = async (stat) => {
  setSaving(true);
  try {
    const payload = {
      basicStatId: stat.basicStatId,
      minutes: stat.minutes,
      twoPtAttempts: Number(stat.twoPtAttempts),
      twoPtMade: Number(stat.twoPtMade),
      threePtAttempts: Number(stat.threePtAttempts),
      threePtMade: Number(stat.threePtMade),
      ftAttempts: Number(stat.ftAttempts),
      ftMade: Number(stat.ftMade),
      steals: Number(stat.steals),
      turnovers: Number(stat.turnovers),
      assists: Number(stat.assists),
      blocks: Number(stat.blocks),
      oFRebounds: Number(stat.oFRebounds),
      dFRebounds: Number(stat.dFRebounds),
      pFouls: Number(stat.pFouls),
      dFouls: Number(stat.dFouls),
      plusMinus: stat.plusMinus || 0,
      player: { playerId: stat.playerId },
      game: { gameId: Number(gameId) },
    };

    const res = await api.put(`/basic-stats/put/${stat.basicStatId}`, payload);

    setBasicStats((prev) =>
      prev.map((s) =>
        s.basicStatId === stat.basicStatId ? { ...s, editable: false } : s
      )
    );

    alert(`✅ Saved updates for ${stat.playerName}`);
  } catch (err) {
    console.error("Failed to save basic stat:", err);
    alert("❌ Failed to save stat.");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <main className="main-content">
      <h1>Game Details — Game ID: {gameId}</h1>
      <h2>Team ID: {teamId}</h2>
      <div className="stats-tabs">
        <button className={`tab-button ${activeTab === "basic" ? "active" : ""}`} onClick={() => setActiveTab("basic")}>
          Basic Stats
        </button>
        <button
          className={`tab-button ${activeTab === "advanced" ? "active" : ""}`}
          onClick={() => setActiveTab("advanced")}
        >
          Advanced Stats
        </button>
        <button
          className={`tab-button ${activeTab === "adjusted" ? "active" : ""}`}
          onClick={() => setActiveTab("adjusted")}
        >
          Physical Based Metrics
        </button>
      </div>

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
                    onClick={() => {
                    setSelectedStat(playerStat);
                    setShowEditModal(true);
                    }}
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
        <div className="stats-content">
         {activeTab === "basic" && (
  <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>MIN</th>
                  <th>PTS</th>
                  <th>2 PTS M/A</th>
                  <th>3 PTS M/A</th>
                  <th>FT M/A</th>
                  <th>STL</th>
                  <th>TO</th>
                  <th>AST</th>
                  <th>BLK</th>
                  <th>OREB</th>
                  <th>DREB</th>
                  <th>PF</th>
                  <th>DF</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {basicStats.map((playerStat) => (
                  <tr key={playerStat.basicStatId}>
                    <td>{playerStat.playerName}</td>
                    <td>{playerStat.minutes}</td>
                    <td>{playerStat.gamePoints}</td>
                    <td>{playerStat.twoPtMade}/{playerStat.twoPtAttempts}</td>
                    <td>{playerStat.threePtMade}/{playerStat.threePtAttempts}</td>
                    <td>{playerStat.ftMade}/{playerStat.ftAttempts}</td>
                    <td>{playerStat.steals}</td>
                    <td>{playerStat.turnovers}</td>
                    <td>{playerStat.assists}</td>
                    <td>{playerStat.blocks}</td>
                    <td>{playerStat.oFRebounds}</td>
                    <td>{playerStat.dFRebounds}</td>
                    <td>{playerStat.pFouls}</td>
                    <td>{playerStat.dFouls}</td>
                    <td><EditIcon/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
)}

        {activeTab === "advanced" && (
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>EFG</th>
                  <th>TS</th>
                  <th>USG</th>
                  <th>AST RATIO</th>
                  <th>TO RATIO</th>
                  <th>PIE</th>
                  <th>ORTG</th>
                  <th>DRTG</th>
                  <th>REB %</th>
                  <th>ORB %</th>
                  <th>DRB %</th>
                  <th>AST %</th>
                  <th>STL %</th>
                  <th>BLK %</th>
                  <th>TOV %</th>
                  <th>FTR</th>
                  
                </tr>
              </thead>
              <tbody>
                {advancedStats.map((playerStat) => (
                  <tr key={playerStat.advancedStatId}>
                    <td>{playerStat.basicStatsDTO.playerName}</td>
                    <td>{playerStat.eFG}</td>
                    <td>{playerStat.ts}</td>
                    <td>{playerStat.usg}</td>
                    <td>{playerStat.assistRatio}</td>
                    <td>{playerStat.turnoverRatio}</td>
                    <td>{playerStat.pie}</td>
                    <td>{playerStat.ortg}</td>
                    <td>{playerStat.drtg}</td>
                    <td>{playerStat.rebPercentage}</td>
                    <td>{playerStat.orbPercentage}</td>
                    <td>{playerStat.drbPercentage}</td>
                    <td>{playerStat.astPercentage}</td>
                    <td>{playerStat.stlPercentage}</td>
                    <td>{playerStat.blkPercentage}</td>
                    <td>{playerStat.tovPercentage}</td>
                    <td>{playerStat.ftr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "adjusted" && (
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>Athletic Performance Index</th>
                  <th>Defensive Disruption Rating</th>
                  <th>Rebound Potential Index</th>
                  <th>Mobility Adjusted Build Score</th>
                  <th>Position Suitability Index</th>
                </tr>
              </thead>
              <tbody>
                {physicalMetrics.map((playerStat) => (
                  <tr key={playerStat.physicalBasedMetricsStatsId}>
                    <td>{playerStat.basicStatsDTO.playerName}</td>
                    <td>{playerStat.athleticPerformanceIndex}</td>
                    <td>{playerStat.defensiveDisruptionRating}</td>
                    <td>{playerStat.reboundPotentialIndex}</td>
                    <td>{playerStat.mobilityAdjustedBuildScore}</td>
                    <td>{playerStat.positionSuitabilityIndex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      {showEditModal && (
  <BasicStatsEditModal
    initialData={selectedStat}
    onClose={() => setShowEditModal(false)}
    onSave={(updatedData) => {
      handleSaveStats({ ...selectedStat, ...updatedData });
      setShowEditModal(false);
    }}
  />
)}

    </main>
    
  );
}

export default CGameDetails;
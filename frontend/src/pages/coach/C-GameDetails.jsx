import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { api } from "../../utils/axiosConfig";
import '../../styles/coach/C-GameDetails.css';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import BasicStatsEditModal from "../../components/BasicStatsEditModal";
import CreateBasicStatsModal from "../../components/CreateBasicStatsModal";

function CGameDetails() {

  const { id: gameId } = useParams();
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("teamId");

  const [isEditingComment, setIsEditingComment] = useState(false);
  const [showOrientationWarning, setShowOrientationWarning] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameDetails, setGameDetails] = useState();
  const [basicStats, setBasicStats] = useState([]);
  const [advancedStats, setAdvancedStats] = useState([]);
  const [physicalMetrics, setPhysicalMetrics] = useState([]);
  const [basicStatsInputs, setBasicStatsInputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState("")
  const [showAddModal, setShowAddModal] = useState(false);
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
        setComments(gameRes.data.comments);
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
        console.log("Game Id: ", gameId);
        setLoading(false);
      }
    };

    fetchEverything();
  }, [gameId, teamId]);

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
        plusMinus: Number(0),
        minutes: playerStat.minutes,
        player: { playerId: playerStat.selectedPlayer },
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
      alert(`✅ Stats created for player`);
    } catch (error) {
      console.error(`❌ Failed to create basic stats: `, error);
      alert(`❌ Failed to create stats for player ${playerStat.playerId}`);
    } finally {
      setSaving(false);
      setShowAddModal(false);
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
        minutes: playerStat.minutes
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
      alert(`✅ Stats updated for player ${playerStat.playerName}`);
    } catch (error) {
      console.error("❌ Failed to update basic stats:", error);
      alert(`❌ Failed to update stats for player ${playerStat.playerId}`);
    } finally {
      setSaving(false);
    }
    window.location.reload();
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
    (p) => !basicStats.some((stat) => stat.playerId === p.playerId)
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

  const handleSaveComments = async () => {
    if (!gameId) {
      alert("Game ID is missing!");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        gameName: gameDetails.gameName,  // Or fetch game details if not already available
        gameDate: gameDetails.gameDate,  // Similar as above, should be in gameDetails
        gameType: gameDetails.gameType,
        gameResult: gameDetails.gameResult,  // Same as above
        finalScore: gameDetails.finalScore,  // Same as above
        comments: comments,  // Save the comments entered by the user
        team: {
          teamId: teamId  // Already obtained from query params
        }
      };

      // Send the PUT request to update the game comments
      const response = await api.put(`/games/put/${gameId}`, payload);

      if (response.status === 200) {
        alert("✅ Comments saved successfully!");
      } else {
        alert("❌ Failed to save comments. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save comments:", error);
      alert("❌ Failed to save comments. Please try again.");
    } finally {
      setSaving(false);
    }
    window.location.reload();
  };


  if (loading) return <div className="loading">Loading players...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <main className="main-content">
      <div className="game-header">
        <div className="game-title">
          <h1 style={{ color: "white" }}>{gameDetails.gameName}</h1>
          <span className="game-date">{gameDetails.gameDate} {gameDetails.gameType}</span>
        </div>
        <div className="game-score">
          <span className={`game-result ${gameDetails.gameResult === "W" ? "win" : "loss"}`}>
            {gameDetails.gameResult === "W" ? "Win" : "Loss"}
          </span>
          <span className="score-display" style={{ color: "white" }}>{gameDetails.finalScore}</span>
        </div>
      </div>

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
        <button
          className="create-team-button"
          onClick={() => {
            const isMobile = window.innerWidth <= 768;
            const isPortrait = window.matchMedia("(orientation: portrait)").matches;

            if (isMobile && isPortrait) {
              setShowOrientationWarning(true); // Show MUI warning
              // Optionally, delay showing modal for smoother UX
              setTimeout(() => setShowAddModal(true), 2000);
            } else {
              setShowAddModal(true);
            }
          }}

          disabled={availablePlayers.length === 0}
        >
          Add Row
        </button>
      </div>

      <div className="players-table-container">
        <div className="stats-content">
          {activeTab === "basic" && (
            <div>

              <div className="stats-table-container">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Player Name</th>
                      <Tooltip title="Minutes Played"><th>MIN</th></Tooltip>
                      <Tooltip title="Points"><th>PTS</th></Tooltip>
                      <Tooltip title="2 Points Made and Attempted"><th>2 PTS M/A</th></Tooltip>
                      <Tooltip title="3 Points Made and Attempted"><th>3 PTS M/A</th></Tooltip>
                      <Tooltip title="Free Throws Made and Attempted"><th>FT M/A</th></Tooltip>
                      <Tooltip title="Steals"><th>STL</th></Tooltip>
                      <Tooltip title="Turn Overs"><th>TO</th></Tooltip>
                      <Tooltip title="Assists"><th>AST</th></Tooltip>
                      <Tooltip title="Blocks"><th>BLK</th></Tooltip>
                      <Tooltip title="Offensive Rebound"><th>OREB</th></Tooltip>
                      <Tooltip title="Defensive Rebound"><th>DREB</th></Tooltip>
                      <Tooltip title="Personal Fouls"><th>PF</th></Tooltip>
                      <Tooltip title="Defensive Fouls"><th>DF</th></Tooltip>
                      <Tooltip title="Plus Minus"><th>+/-</th></Tooltip>
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
                        <td>{playerStat.plusMinus}</td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedStat(playerStat);
                              setShowEditModal(true);
                            }}
                            className="icon-button"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                          >
                            <EditIcon />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="stats-table-container">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Player Name</th>
                    <Tooltip title="Player Efficiency Rating"><th>PER</th></Tooltip>
                    <Tooltip title="Effective Field Goal Percentage"><th>EFG%</th></Tooltip>
                    <Tooltip title="True Shooting Percentage"><th>TS%</th></Tooltip>
                    <Tooltip title="Usage Percentage"><th>USG%</th></Tooltip>
                    <Tooltip title="Assist Ratio"><th>AST RATIO</th></Tooltip>
                    <Tooltip title="Turn Over Ratio"><th>TO RATIO</th></Tooltip>
                    <Tooltip title="Free Throw Rating"><th>FTR</th></Tooltip>
                    <Tooltip title="Assist to Turn Over Ratio"><th>AST:TO</th></Tooltip>
                    <Tooltip title="Offensive Rating"><th>ORTG</th></Tooltip>
                    <Tooltip title="Points Per Minute"><th>PPM</th></Tooltip>
                    <Tooltip title="Shooting Efficiency Percentage"><th>SE%</th></Tooltip>
                    <Tooltip title="Points Per Shot"><th>PPS</th></Tooltip>

                  </tr>
                </thead>
                <tbody>
                  {advancedStats.map((playerStat) => (
                    <tr key={playerStat.advancedStatId}>
                      <td>{playerStat.basicStatsDTO.playerName}</td>
                      <td>{playerStat.uPER}</td>
                      <td>{playerStat.eFG}</td>
                      <td>{playerStat.ts}</td>
                      <td>{playerStat.usgPercentage}</td>
                      <td>{playerStat.assistRatio}</td>
                      <td>{playerStat.turnoverRatio}</td>
                      <td>{playerStat.ftr}</td>
                      <td>{playerStat.atRatio}</td>
                      <td>{playerStat.ortg}</td>
                      <td>{playerStat.pointsPerMinute}</td>
                      <td>{playerStat.shootingEfficiency}</td>
                      <td>{playerStat.pointsPerShot}</td>
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
                    <th>Finishing Efficiency</th>
                    <th>Rebounding Efficiency</th>
                    <th>Defensive Activity Index</th>
                    <th>Physical Efficiency Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {physicalMetrics.map((playerStat) => (
                    <tr key={playerStat.physicalBasedMetricsStatsId}>
                      <td>{playerStat.basicStatsDTO.playerName}</td>
                      <td>{playerStat.finishingEfficiency}</td>
                      <td>{playerStat.reboundingEfficiency}</td>
                      <td>{playerStat.defensiveActivityIndex}</td>
                      <td>{playerStat.physicalEfficiencyRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Snackbar
        open={showOrientationWarning}
        autoHideDuration={4000}
        onClose={() => setShowOrientationWarning(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowOrientationWarning(false)}
          severity="warning"
          variant="filled"
          sx={{ width: "100%", fontWeight: 500 }}
        >
          📱 Please rotate your phone horizontally for better viewing.
        </Alert>
      </Snackbar>
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

      {showAddModal && (
        <CreateBasicStatsModal
          playersList={availablePlayers}
          onClose={() => setShowAddModal(false)}
          onSave={(updatedData) => {
            handleCreateStats({ ...selectedStat, ...updatedData });
            setShowAddModal(false);
          }}
        />
      )}
      <div className="comments-section">
        <h3>Game Comments</h3>

        {/* If editing, show textarea to edit comment */}
        {isEditingComment ? (
          <div>
            <textarea
              className="comments-textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your comments about this game..."
              rows={5}
            ></textarea>
            <button className="save-comments-button" onClick={handleSaveComments}>
              Save Changes
            </button>
          </div>
        ) : (
          // Otherwise, display the comment text as read-only
          <div>
            <p className="comments-textarea">{comments || "No comments added yet."}</p>
            <button className="save-comments-button" onClick={() => setIsEditingComment(true)}>
              Edit Comment
            </button>
          </div>
        )}
      </div>

    </main>

  );
}

export default CGameDetails;
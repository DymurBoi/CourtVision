"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-MatchDetails.css"

function PMatchDetails() {
  const { id: gameId } = useParams()
  const [gameDetails, setGameDetails] = useState()
  const [basicStats, setBasicStats] = useState([])
  const [advancedStats, setAdvancedStats] = useState([])
  const [physicalMetrics, setPhysicalMetrics] = useState([])
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ First, fetch game details
        const gameRes = await api.get(`/games/get/${gameId}`);
        setGameDetails(gameRes.data);

        const [basicRes, advRes, physRes] = await Promise.all([
          api.get(`/basic-stats/get/by-game/${gameId}`).catch(() => ({ data: [] })),
          api.get(`/advanced-stats/get/by-game/${gameId}`).catch(() => ({ data: [] })),
          api.get(`/physical-metrics/get/by-game/${gameId}`).catch(() => ({ data: [] })),
        ]);
        setBasicStats(basicRes.data);
        setAdvancedStats(advRes.data);
        setPhysicalMetrics(physRes.data);
        if (!basicRes.data?.length) console.warn("No Basic Stats found for this game.");
      } catch (err) {
        console.error("Error fetching game details:", err);
        setError("Failed to load match details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);


  if (loading) return <div className="loading">Loading match details...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <main className="main-content">
      {/* Game Header */}
      <div className="game-header">
        <div className="game-title">
          <h1>{gameDetails.gameName}</h1>
          <span className="game-date">
            {gameDetails.gameDate} {gameDetails.gameType}
          </span>
        </div>
        <div className="game-score">
          <span className={`game-result ${gameDetails.gameResult === "W" ? "win" : "loss"}`}>
            {gameDetails.gameResult === "W" ? "Win" : "Loss"}
          </span>
          <span className="score-display">{gameDetails.finalScore}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="stats-tabs">
        <button
          className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
          onClick={() => setActiveTab("basic")}
        >
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

      {/* Tables */}
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
                  <th>+/-</th>
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
                  <th>PER</th>
                  <th>EFG%</th>
                  <th>TS%</th>
                  <th>USG%</th>
                  <th>AST RATIO</th>
                  <th>TO RATIO</th>
                  <th>FTR</th>
                  <th>AST:TO</th>
                  <th>ORTG</th>
                  <th>PPM</th>
                  <th>SE%</th>
                  <th>PPS</th>
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

      {/* Game Comments */}
      <div className="comments-section">
        <h3>Coach Comments</h3>
        <p className="comments-textarea">
          {gameDetails.comments || "No comments from the coach yet."}
        </p>
      </div>
    </main>
  )
}

export default PMatchDetails

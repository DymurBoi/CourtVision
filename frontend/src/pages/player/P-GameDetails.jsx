import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { api } from "../../utils/axiosConfig"
import Tooltip from '@mui/material/Tooltip';
import '../../styles/coach/C-GameDetails.css'

function PGameDetails() {
  const { id: gameId } = useParams()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const teamId = params.get("teamId")

  const [basicStats, setBasicStats] = useState([])
  const [advancedStats, setAdvancedStats] = useState([])
  const [physicalMetrics, setPhysicalMetrics] = useState([])
  const [gameDetails, setGameDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    const fetchGameData = async () => {
      if (!teamId || !gameId) {
        setError("Missing game or team ID.")
        setLoading(false)
        return
      }

      try {
        const gameRes = await api.get(`/games/get/${gameId}`)
        setGameDetails(gameRes.data)

        await Promise.all([
          api.get(`/basic-stats/get/by-game/${gameId}`).then(res => setBasicStats(res.data)),
          api.get(`/advanced-stats/get/by-game/${gameId}`).then(res => setAdvancedStats(res.data)),
          api.get(`/physical-metrics/get/by-game/${gameId}`).then(res => setPhysicalMetrics(res.data)),
        ])
      } catch (err) {
        console.error("Failed to fetch game details:", err)
        setError("Failed to load game details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [gameId, teamId])

  if (loading) return <div className="loading">Loading game details...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <main className="main-content">
      {gameDetails && (
         
      <div className="game-header">
        <div className="game-title">
            <h1>{gameDetails.gameName}</h1>
            <span className="game-date">{gameDetails.gameDate}</span>
        </div>
        <div className="game-score">
          <span className={`game-result ${gameDetails.gameResult === "W" ? "win" : "loss"}`}>
            {gameDetails.gameResult === "W" ? "Win" : "Loss"}
          </span>
          <span className="score-display">{gameDetails.finalScore}</span>
        </div>
      </div>
      )}

      <div className="stats-tabs">
        <button className={`tab-button ${activeTab === "basic" ? "active" : ""}`} onClick={() => setActiveTab("basic")}>
          Basic Stats
        </button>
        <button className={`tab-button ${activeTab === "advanced" ? "active" : ""}`} onClick={() => setActiveTab("advanced")}>
          Advanced Stats
        </button>
        <button className={`tab-button ${activeTab === "adjusted" ? "active" : ""}`} onClick={() => setActiveTab("adjusted")}>
          Physical Metrics
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
    </main>
  )
}

export default PGameDetails

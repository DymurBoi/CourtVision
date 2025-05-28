import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { api } from "../../utils/axiosConfig"
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
      <h1>Game Details</h1>
      {gameDetails && (
        <>
          <h2>{gameDetails.gameName}</h2>
          <p>Date: {new Date(gameDetails.gameDate).toLocaleDateString()}</p>
          <p>Result: {gameDetails.gameResult}</p>
          <p>Final Score: {gameDetails.finalScore}</p>
        </>
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

      <div className="stats-content">
        {activeTab === "basic" && (
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
                <th>PF/DF</th>
              </tr>
            </thead>
            <tbody>
              {basicStats.map((stat) => (
                <tr key={stat.basicStatId}>
                  <td>{stat.playerName}</td>
                  <td>{stat.minutes}</td>
                  <td>{stat.gamePoints}</td>
                  <td>{stat.twoPtMade}/{stat.twoPtAttempts}</td>
                  <td>{stat.threePtMade}/{stat.threePtAttempts}</td>
                  <td>{stat.ftMade}/{stat.ftAttempts}</td>
                  <td>{stat.steals}</td>
                  <td>{stat.turnovers}</td>
                  <td>{stat.assists}</td>
                  <td>{stat.blocks}</td>
                  <td>{stat.oFRebounds}</td>
                  <td>{stat.dFRebounds}</td>
                  <td>{stat.pFouls}/{stat.dFouls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "advanced" && (
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player Name</th>
                  <th>UPER</th>
                  <th>EFG</th>
                  <th>TS</th>
                  <th>USG %</th>
                  <th>AST RATIO</th>
                  <th>TO RATIO</th>
                  <th>FTR</th>
                  <th>AST:TO</th>
                  <th>ORTG</th>
                  <th>PPM</th>
                  <th>SE</th>
                  <th>PPS %</th>
                  
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
    </main>
  )
}

export default PGameDetails

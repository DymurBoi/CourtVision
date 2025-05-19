"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import '../../styles/coach/C-GameDetails.css';
import CreateMatchModal from '../../components/CreateMatchModal';

// Sample match data
const matchesData = [
  {
    id: 1,
    homeTeam: "CIT-U",
    awayTeam: "USJR",
    result: "W",
    score: "78-65",
    date: "05/15/2023",
    players: [
      {
        id: 1,
        name: "James Wilson",
        minutes: 32,
        pts2MA: "5/8",
        pts3MA: "2/5",
        ftMA: "4/4",
        steals: 3,
        turnovers: 2,
        assists: 7,
        blocks: 0,
        ofRebounds: 1,
        dfRebounds: 4,
        fouls: "2/1",
        advanced: {
          ts: "68.5%",
          offRating: 118.4,
          defRating: 102.3,
          astToRatio: 3.5,
          astRatio: 24.8,
          toRatio: 7.1,
          pie: 15.2,
          per: 22.4,
          efg: "58.3%",
          usage: "22.1%",
        },
      },
      {
        id: 2,
        name: "Robert Garcia",
        minutes: 28,
        pts2MA: "4/9",
        pts3MA: "3/7",
        ftMA: "2/2",
        steals: 1,
        turnovers: 3,
        assists: 2,
        
        blocks: 0,
        ofRebounds: 0,
        dfRebounds: 3,
        fouls: "3/2",
        advanced: {
          ts: "54.2%",
          offRating: 109.7,
          defRating: 105.8,
          astToRatio: 0.67,
          astRatio: 8.2,
          toRatio: 12.3,
          pie: 10.5,
          per: 16.8,
          efg: "50.0%",
          usage: "18.7%",
        },
      },
      {
        id: 3,
        name: "Michael Chen",
        minutes: 35,
        pts2MA: "6/10",
        pts3MA: "1/3",
        ftMA: "5/6",
        steals: 2,
        turnovers: 1,
        assists: 3,
        blocks: 1,
        ofRebounds: 2,
        dfRebounds: 5,
        fouls: "2/3",
        advanced: {
          ts: "62.8%",
          offRating: 115.2,
          defRating: 103.5,
          astToRatio: 3.0,
          astRatio: 10.5,
          toRatio: 3.5,
          pie: 14.8,
          per: 21.2,
          efg: "55.8%",
          usage: "20.3%",
        },
      },
      {
        id: 4,
        name: "David Smith",
        minutes: 30,
        pts2MA: "7/12",
        pts3MA: "0/1",
        ftMA: "3/5",
        steals: 0,
        turnovers: 2,
        assists: 1,
        blocks: 3,
        ofRebounds: 3,
        dfRebounds: 7,
        fouls: "4/1",
        advanced: {
          ts: "53.1%",
          offRating: 107.3,
          defRating: 98.6,
          astToRatio: 0.5,
          astRatio: 4.2,
          toRatio: 8.4,
          pie: 13.2,
          per: 19.5,
          efg: "53.8%",
          usage: "19.8%",
        },
      },
      {
        id: 5,
        name: "Christopher Johnson",
        minutes: 25,
        pts2MA: "3/6",
        pts3MA: "0/0",
        ftMA: "2/4",
        steals: 1,
        turnovers: 3,
        assists: 0,
        blocks: 2,
        ofRebounds: 4,
        dfRebounds: 6,
        fouls: "3/0",
        advanced: {
          ts: "42.3%",
          offRating: 98.5,
          defRating: 101.2,
          astToRatio: 0,
          astRatio: 0,
          toRatio: 15.2,
          pie: 9.8,
          per: 14.3,
          efg: "50.0%",
          usage: "15.6%",
        },
      },
    ],
  },
  // Other matches data would be here
]

function CGameDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [match, setMatch] = useState(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [comments, setComments] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Find the match with the given ID
    const foundMatch = matchesData.find((m) => m.id === Number.parseInt(id))
    if (foundMatch) {
      setMatch(foundMatch)
    }
  }, [id])

  const handleSaveComments = () => {
    // In a real app, this would save to a database
    alert("Comments saved successfully!")
  }

  const handleEditMatch = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = (updatedMatch) => {
    // Update the match data
    setMatch({
      ...match,
      ...updatedMatch,
    })
    setIsEditing(false)

    // In a real app, this would save to a database
    alert("Match updated successfully!")
  }

  const handleDeleteMatch = () => {
    if (window.confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      // In a real app, this would delete from a database
      alert("Match deleted successfully!");
      navigate("/coach/matches"); // Redirect to matches page
    }
  }

  if (!match) {
    return <div className="loading">Loading game details...</div>
  }

  return (
    <main className="main-content">
      <div className="game-header">
        <div className="game-title">
          <h1>
            {match.homeTeam} vs {match.awayTeam}
          </h1>
          <span className="game-date">{match.date}</span>
        </div>
        <div className="game-score">
          <span className={`game-result ${match.result === "W" ? "win" : "loss"}`}>
            {match.result === "W" ? "Win" : "Loss"}
          </span>
          <span className="score-display">{match.score}</span>
        </div>
      </div>

      <div className="game-actions">
        <button className="edit-game-button" onClick={handleEditMatch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="action-icon"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit Game
        </button>
        <button className="delete-game-button" onClick={handleDeleteMatch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="action-icon"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Delete Game
        </button>
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
          Adjusted Stats
        </button>
      </div>

      <div className="stats-content">
        {activeTab === "basic" && (
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
                {match.players.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.minutes}</td>
                    <td>{player.pts2MA}</td>
                    <td>{player.pts3MA}</td>
                    <td>{player.ftMA}</td>
                    <td>{player.steals}</td>
                    <td>{player.turnovers}</td>
                    <td>{player.assists}</td>
                    <td>{player.blocks}</td>
                    <td>{player.ofRebounds}</td>
                    <td>{player.dfRebounds}</td>
                    <td>{player.fouls}</td>
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
                  <th>MIN</th>
                  <th>TS%</th>
                  <th>OFF RTG</th>
                  <th>DEF RTG</th>
                  <th>AST/TO</th>
                  <th>AST%</th>
                  <th>TO%</th>
                  <th>PIE</th>
                  <th>PER</th>
                  <th>EFG</th>
                  <th>USG%</th>
                </tr>
              </thead>
              <tbody>
                {match.players.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.minutes}</td>
                    <td>{player.advanced?.ts || "N/A"}</td>
                    <td>{player.advanced?.offRating || "N/A"}</td>
                    <td>{player.advanced?.defRating || "N/A"}</td>
                    <td>{player.advanced?.astToRatio || "N/A"}</td>
                    <td>{player.advanced?.astRatio || "N/A"}</td>
                    <td>{player.advanced?.toRatio || "N/A"}</td>
                    <td>{player.advanced?.pie || "N/A"}</td>
                    <td>{player.advanced?.per || "N/A"}</td>
                    <td>{player.advanced?.efg || "N/A"}</td>
                    <td>{player.advanced?.usage || "N/A"}</td>
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
                  <th>Adjusted Stats Coming Soon</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2" className="empty-table-message">
                    Adjusted statistics will be available in a future update.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="comments-section">
        <h3>Game Comments</h3>
        <textarea
          className="comments-textarea"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add your comments about this game..."
          rows={5}
        ></textarea>
        <button className="save-comments-button" onClick={handleSaveComments}>
          Save Comments
        </button>
      </div>

      {isEditing && (
        <CreateMatchModal onClose={() => setIsEditing(false)} onSave={handleSaveEdit} initialData={match} />
      )}
    </main>
  )
}

export default CGameDetails

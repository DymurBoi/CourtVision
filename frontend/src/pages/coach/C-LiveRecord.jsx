"use client"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CoachNavbar from "../../components/CoachNavbar"
import "../../styles/coach/C-LiveRecord.css"
import { api } from "../../utils/axiosConfig";
import { useLocation } from "react-router-dom";

function CLiveRecord() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [time, setTime] = useState(0) // time in seconds
  const [showModal, setShowModal] = useState(false)
  const [isAddMode, setIsAddMode] = useState(true) // true = add, false = subtract
  // Track which team and which player index is selected to always read fresh state
  const [selectedRef, setSelectedRef] = useState(null) // { team: 'A'|'B', index: number }
  const [showSubModal, setShowSubModal] = useState(false)
  //First Five Modal
  const [showFirstFiveModal, setShowFirstFiveModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]); 
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [confirmedFirstFive, setConfirmedFirstFive] = useState([]);

  //getting the teamid and gameid from the query string
  const location = useLocation();
  const { id: gameId } = useParams();
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("teamId");

  //BasicStats
  const [teamABasicStats, setTeamABasicStats] = useState([]);

   //First Five Confirmation
   const [firstFivePlayers, setFirstFivePlayers] = useState([]);
  // Sample team data - you can replace this with actual data from props or API
  const [teamA, setTeamA] = useState({})

  const [teamB, setTeamB] = useState({
    name: "USJR",
    players: [
      {
        id: 6,
        jerseyNum: 11,
        lastName: "Garcia",
        stats: { ORB: 2, DRB: 4, AST: 5, STL: 1, BLK: 1, TO: 2, points: 14 },
      },
      {
        id: 7,
        jerseyNum: 22,
        lastName: "Martinez",
        stats: { ORB: 1, DRB: 3, AST: 2, STL: 3, BLK: 0, TO: 1, points: 16 },
      },
      { id: 8, jerseyNum: 5, lastName: "Lopez", stats: { ORB: 0, DRB: 2, AST: 8, STL: 1, BLK: 0, TO: 4, points: 9 } },
      {
        id: 9,
        jerseyNum: 33,
        lastName: "Rodriguez",
        stats: { ORB: 4, DRB: 7, AST: 1, STL: 0, BLK: 2, TO: 1, points: 20 },
      },
      {
        id: 10,
        jerseyNum: 8,
        lastName: "Hernandez",
        stats: { ORB: 1, DRB: 1, AST: 3, STL: 2, BLK: 1, TO: 3, points: 6 },
      },
      { id: 13, jerseyNum: 4, lastName: "Sanchez", stats: { ORB: 0, DRB: 1, AST: 0, STL: 0, BLK: 0, TO: 0, points: 0 } },
      { id: 14, jerseyNum: 14, lastName: "Torres", stats: { ORB: 0, DRB: 0, AST: 1, STL: 0, BLK: 0, TO: 0, points: 0 } },
    ],
  })

  // Track the 5 on-court players as indices for each team
  const [teamAOnCourt, setTeamAOnCourt] = useState([])
  const [teamBOnCourt, setTeamBOnCourt] = useState([0, 1, 2, 3, 4])

  const [teamAScore] = useState(55)
  const [teamBScore] = useState(65)
  


  //BasicStats Payload and logic
const handleConfirmFirstFiveModal = async () => {
  if (selectedPlayers.length !== 5) { 
    console.warn("You must select exactly 5 players."); 
    return; 
  }
  try {
    console.log("Game Id: ",gameId);
      const statsList = selectedPlayers.map(player => ({
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
    subbedIn: true,
    player: {
      playerId: player
    },
    game: {
      gameId: gameId
    }
  }));

        console.log("Json Body:\n",statsList);
        const res = await api.post("/basic-stats/post/batch", statsList);
        console.log("Created BasicStats:", res.data);

      // Match selected IDs to full player objects
      const confirmedPlayers = teamPlayers.filter(p =>
        selectedPlayers.includes(p.playerId)
      );

      setConfirmedFirstFive(confirmedPlayers);

      // Map indices for on-court
      /*setTeamAOnCourt(
        confirmedPlayers.map(p =>
          teamA.players.findIndex(tp => tp.id === p.playerId)
        )
      );*/

      setShowFirstFiveModal(false);
    } catch (err) {
      console.error("Error creating first five BasicStats:", err);
    }
  };


  // Timer effect
  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((time) => time + 1)
      }, 1000)
    } else if (!isPlaying && time !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isPlaying, time])


  // Fetch team players with teamId
  // 🟢 Fetch players when First Five modal opens
    useEffect(() => {
      if (showFirstFiveModal && teamId) {
        console.log("Fetching players for teamId:", teamId);
        api
          .get(`/players/get/by-team/${teamId}`)
          .then((res) => {
            console.log("Team Players fetched successfully:", res.data);
            setTeamPlayers(res.data);
          })
          .catch((err) => {
            setTeamPlayers([]);
            console.error("Failed to fetch team players:", err);
          });
      }
      console.log("Game Id: ",gameId);
    }, [showFirstFiveModal, teamId]);


    //Fetch BasicStats for Team A when gameId and teamId are available
   useEffect(() => {
  if (gameId) {
    api
      .get(`/basic-stats/get/subbed-in/${gameId}`)
      .then((res) => {
        console.log("Subbed-in stats:", res.data);
        setTeamABasicStats(res.data); // Each has player info
      })
      .catch((err) => {
        console.error("Failed to fetch Subbed-In BasicStats:", err);
        setTeamABasicStats([]);
      });
  }
}, [gameId]);
  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePlayerClick = (team, index) => {
    setSelectedRef({ team, index })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedRef(null)
  }

  const handleStatUpdate = (statType, amount = 1) => {
    if (!selectedRef) return

    const delta = (isAddMode ? 1 : -1) * amount
    if (selectedRef.team === 'A') {
      setTeamA((prev) => {
        const next = { ...prev, players: [...prev.players] }
        const player = { ...next.players[selectedRef.index], stats: { ...next.players[selectedRef.index].stats } }
        const nextValue = Math.max(0, (player.stats[statType] || 0) + delta)
        player.stats[statType] = nextValue
        next.players[selectedRef.index] = player
        return next
      })
    } else {
      setTeamB((prev) => {
        const next = { ...prev, players: [...prev.players] }
        const player = { ...next.players[selectedRef.index], stats: { ...next.players[selectedRef.index].stats } }
        const nextValue = Math.max(0, (player.stats[statType] || 0) + delta)
        player.stats[statType] = nextValue
        next.players[selectedRef.index] = player
        return next
      })
    }
  }

  const handleSubstitute = () => {
    setShowSubModal(true)
  }

  const handleChooseSubstitute = (newIndex) => {
    if (!selectedRef) return
    // Swap bench player into the current lineup slot
    swapIntoLineup(selectedRef.team, selectedRef.index, newIndex)
    // Update selection to the new player so modal shows stats for substituted player
    setSelectedRef({ team: selectedRef.team, index: newIndex })
    setShowSubModal(false)
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const currentPlayer = selectedRef
    ? selectedRef.team === 'A'
      ? teamA.players[selectedRef.index]
      : teamB.players[selectedRef.index]
    : null

  // When a bench player is chosen, swap them with the current on-court player
  const swapIntoLineup = (team, oldIndex, newIndex) => {
    if (team === 'A') {
      setTeamAOnCourt((prev) => {
        const next = [...prev]
        const slot = next.indexOf(oldIndex) 
        if (slot !== -1) next[slot] = newIndex
        return next
      })
    } else {
      setTeamBOnCourt((prev) => {
        const next = [...prev]
        const slot = next.indexOf(oldIndex)
        if (slot !== -1) next[slot] = newIndex
        return next
      })
    }
  }

  const handleCheckboxChange = (playerId) => {
    console.log(playerId);
    console.log(selectedPlayers);
  setSelectedPlayers((prev) => {
    if (prev.includes(playerId)) {
      return prev.filter(id => id !== playerId);
    } else if (prev.length < 5) {
      return [...prev, playerId];
    } else {
      alert("You can only select 5 players!");
      return prev;
    }
  });
};


  return (
    <div className="live-record-page">
      <CoachNavbar />

      <div className="live-record-container">
        {/* Header/Banner */}
        <div className="game-header">
          <div className="game-info-left">
            <div className="team-names">
              {teamA.name} VS {teamB.name}
            </div>
            <div className="game-date">{getCurrentDate()}</div>
          </div>

          <div className="game-info-center">
            <div className="score-display">
              <span className="team-score">{teamAScore}</span>
              <span className="score-separator">-</span>
              <span className="team-score">{teamBScore}</span>
            </div>
          </div>

          <div className="game-info-right">
            <div className="timer-controls">
              <button className={`play-pause-btn ${isPlaying ? "playing" : "paused"}`} onClick={handlePlayPause}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div className="timer-display">{formatTime(time)}</div>
            </div>
          </div>
        </div>

        {/* Players Display */}
        <div className="teams-container">
        <div className="team-section">
          <h3 className="team-title">{teamA?.name || "Team A"}</h3>
          <div className="players-grid">
            {teamABasicStats.length === 0 ? (
              <div className="player-card no-players">No players subbed in</div>
            ) : (
              teamABasicStats.map((stat) => (
                <div
                  key={stat.playerId}
                  className="player-card selected"
                  onClick={() =>
                    handlePlayerClick("A", teamA.players.findIndex(tp => tp.id === stat.playerId))
                  }
                >
                  <div className="jersey-number">#{stat.jerseyNum}</div>
                  <div className="player-name">{stat.fname} {stat.lname}</div>
                </div>
              ))
            )}
          </div>
        </div>

          <div className="team-section">
            <h3 className="team-title">{teamB.name}</h3>
            <div className="players-grid">
              {teamBOnCourt.map((idx) => {
                const player = teamB.players[idx]
                return (
                <div key={player.id} className="player-card" onClick={() => handlePlayerClick('B', idx)}>
                  <div className="jersey-number">#{player.jerseyNum}</div>
                  <div className="player-name">{player.lastName}</div>
                </div>
              )})}
            </div>
          </div>
        </div>
          <div style={{ paddingTop: "2rem" }}>
            <button className="stat-btn" onClick={() => setShowFirstFiveModal(true) }>
               Add First Five
            </button>
          </div>
      </div>

      {/* Player Stats Modal */}
      {showModal && currentPlayer && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container player-stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                #{currentPlayer.jerseyNum} {currentPlayer.lastName}
              </h2>
              <button className="close-button" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            <div className="modal-content">
              <div className="current-stats">
                <h4>Current Stats</h4>
                <div className="stats-display two-col">
                  <div className="stat-item">
                    <span className="stat-label">PTS:</span>
                    <span className="stat-value">{currentPlayer.stats.points}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">STL:</span>
                    <span className="stat-value">{currentPlayer.stats.STL}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">ORB:</span>
                    <span className="stat-value">{currentPlayer.stats.ORB}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">BLK:</span>
                    <span className="stat-value">{currentPlayer.stats.BLK}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">DRB:</span>
                    <span className="stat-value">{currentPlayer.stats.DRB}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">TO:</span>
                    <span className="stat-value">{currentPlayer.stats.TO}</span>
                  </div>
                  <div className="stat-item ast">
                    <span className="stat-label">AST:</span>
                    <span className="stat-value">{currentPlayer.stats.AST}</span>
                  </div>
                </div>
              </div>

              <div className="stat-controls">
                <h4>Record Stats</h4>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <button className="close-modal-btn" onClick={() => setIsAddMode((m) => !m)}>
                    Mode: {isAddMode ? 'Add' : 'Subtract'}
                  </button>
                </div>
                <div className="stat-buttons">
                  <button className="stat-btn" onClick={() => handleStatUpdate("ORB")}>
                    {isAddMode ? "+" : "-"} ORB
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("DRB")}>
                    {isAddMode ? "+" : "-"} DRB
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("AST")}>
                    {isAddMode ? "+" : "-"} AST
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("STL")}>
                    {isAddMode ? "+" : "-"} STL
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("BLK")}>
                    {isAddMode ? "+" : "-"} BLK
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("TO")}>
                    {isAddMode ? "+" : "-"} TO
                  </button>
                </div>
                <div className="stat-buttons" style={{ marginTop: '0.5rem' }}>
                  <button className="stat-btn" onClick={() => handleStatUpdate("points", 1)}>
                    {isAddMode ? "+" : "-"} 1 PT
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("points", 2)}>
                    {isAddMode ? "+" : "-"} 2 PT
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("points", 3)}>
                    {isAddMode ? "+" : "-"} 3 PT
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="substitute-btn" onClick={handleSubstitute}>
                Substitute Player
              </button>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Substitute Selection Modal */}
      {showModal && showSubModal && selectedRef && (
        <div className="modal-overlay" onClick={() => setShowSubModal(false)}>
          <div className="modal-container player-stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Choose Substitute</h2>
              <button className="close-button" onClick={() => setShowSubModal(false)}>&times;</button>
            </div>
            <div className="modal-content">
              <div className="players-grid">
                {(selectedRef.team === 'A'
                  ? teamA.players.map((p, idx) => ({ p, idx })).filter(({ idx }) => !teamAOnCourt.includes(idx))
                  : teamB.players.map((p, idx) => ({ p, idx })).filter(({ idx }) => !teamBOnCourt.includes(idx))
                  ).map(({ p, idx }) => (
                  <div key={p.id} className="player-card" onClick={() => handleChooseSubstitute(idx)}>
                    <div className="jersey-number">#{p.jerseyNum}</div>
                    <div className="player-name">{p.lastName}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="close-modal-btn" onClick={() => setShowSubModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

   {showFirstFiveModal && (
        <div className="modal-overlay" onClick={() => setShowFirstFiveModal(false)}>
          <div className="modal-container player-stats-modal wide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select First Five Players</h2>
              <button className="close-button" onClick={() => setShowFirstFiveModal(false)}>&times;</button>
            </div>
            <div className="modal-content">
              {/* Check if players are loading or empty */}
              {teamPlayers.length === 0 && teamId ? (
                <p>Loading players or no players found for team ID: {teamId}</p>
              ) : teamPlayers.length === 0 && !teamId ? (
                <p>Error: Team ID is missing from the URL. Please ensure the URL contains `?teamId=...`.</p>
              ) : (
                <div className="players-grid">
                  {/* Assuming API response uses playerId and lname */}
                  {teamPlayers.map((player) => (
                    <div key={player.playerId} className="player-card">
                      <input
                        type="checkbox"
                        checked={selectedPlayers.includes(player.playerId)}
                        onChange={() => handleCheckboxChange(player.playerId)}
                      />
                      <div className="jersey-number">#{player.jerseyNum}</div>
                      <div className="player-name">{player.fname} {player.lname}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
                <button
                    className="stat-btn"
                    onClick={() => {
                        handleConfirmFirstFiveModal();
                        setShowFirstFiveModal(false);
                }}
                  >
                    Confirm First Five
                </button>
              <button className="close-modal-btn" onClick={() => setShowFirstFiveModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CLiveRecord

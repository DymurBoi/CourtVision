"use client"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CoachNavbar from "../../components/CoachNavbar"
import "../../styles/coach/C-LiveRecord.css"
import { api } from "../../utils/axiosConfig";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material"
import { StopCircle } from "lucide-react"

function CLiveRecord() {
  const [gameDetails, setGameDetails] = useState();
  const [opponentStats, setOpponenetStats] = useState();
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

  //BasicStats Update
  const [selectedBasicStat, setSelectedBasicStat] = useState(null);
  const [formStats, setFormStats] = useState(null);

  //getting the teamid and gameid from the query string
  const location = useLocation();
  const { id: gameId } = useParams();
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("teamId");

  //BasicStats for team A or CITU
  const [teamABasicStats, setTeamABasicStats] = useState([]);
  //Score
  const teamAScore = teamABasicStats.reduce((sum, stat) => sum + (stat.points || 0), 0);
  //Subbed Out Players
  const [subbedOutPlayers, setSubbedOutPlayers] = useState([]);
  // Sample team data - you can replace this with actual data from props or API
  const [teamA, setTeamA] = useState({
    name: "",
    players: []  // always exists
  });

  //Timer 
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);


  const [teamB, setTeamB] = useState({
    name: "USJR",
    players: [
      {
        id: 6,
        jerseyNum: 100,
        lastName: "Opponent Player",

      },
    ],
  })

  // Track the 5 on-court players as indices for each team
  const [teamAOnCourt, setTeamAOnCourt] = useState([])
  const [teamBOnCourt, setTeamBOnCourt] = useState([0])

  const [teamBScore] = useState(65)



  //BasicStats Payload and logic for the first five players
  const handleConfirmFirstFiveModal = async () => {
    if (selectedPlayers.length !== 5) {
      console.warn("You must select exactly 5 players.");
      return;
    }

    try {
      console.log("Game Id: ", gameId);

      // 🟢 Build payload for ALL players
      const statsList = teamPlayers.map(player => ({
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
        subbedIn: selectedPlayers.includes(player.playerId), // ✅ starters in
        player: { playerId: player.playerId },
        game: { gameId: gameId }
      }));

      console.log("Json Body:\n", statsList);
      const res = await api.post("/basic-stats/post/batch", statsList);
      console.log("Created BasicStats:", res.data);

      // ✅ Immediately fetch and update subbed-in list so UI refreshes automatically
      const updated = await api.get(`/basic-stats/get/subbed-in/${gameId}`);
      setTeamABasicStats(updated.data);

      // Save confirmed first five (full player objects)
      const confirmedPlayers = teamPlayers.filter(p =>
        selectedPlayers.includes(p.playerId)
      );
      setConfirmedFirstFive(confirmedPlayers);

      // Close modal
      setShowFirstFiveModal(false);
    } catch (err) {
      console.error("Error creating BasicStats for all players:", err);
    }
  };


  //BasicStatsVariation payload and Logic for the opponent team
  const handleUpdateBasicStatsVariation = async () => {
    try {
      const payload = {
        basicStatVarId: formStats.basicStatVarId,
        twoPtAttempts: Number(formStats.twoPtAttempts),
        twoPtMade: Number(formStats.twoPtMade),
        threePtAttempts: Number(formStats.threePtAttempts),
        threePtMade: Number(formStats.threePtMade),
        ftAttempts: Number(formStats.ftAttempts),
        ftMade: Number(formStats.ftMade),
        assists: Number(formStats.assists),
        oFRebounds: Number(formStats.oFRebounds),
        dFRebounds: Number(formStats.dFRebounds),
        blocks: Number(formStats.blocks),
        steals: Number(formStats.steals),
        turnovers: Number(formStats.turnovers),
        pFouls: Number(formStats.pFouls),
        dFouls: Number(formStats.dFouls),
        plusMinus: Number(formStats.plusMinus),
        minutes: formStats.minutes || "00:00:00",
        gamePoints: Number(formStats.gamePoints),
        gameId: gameId
      };

      await api.put(`/basic-stats-var/put/${formStats.basicStatVarId}`, payload);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating enemy stats:", err);
    }
  };


  useEffect(() => {
    const savedStartTime = localStorage.getItem("timer_startTime");
    const savedElapsed = localStorage.getItem("timer_elapsed");
    const savedIsPlaying = localStorage.getItem("timer_isPlaying") === "true";

    if (savedIsPlaying && savedStartTime) {
      // If running → compute how much time passed since start
      const elapsed = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      setTime(elapsed);
      setIsPlaying(true);
    } else if (savedElapsed) {
      // If paused → restore stored elapsed
      setTime(parseInt(savedElapsed, 10));
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("timer_elapsed", newTime); // keep persisting
          return newTime;
        });
      }, 1000);

      // Save absolute startTime so refresh can recalc
      localStorage.setItem("timer_startTime", Date.now() - time * 1000);
      localStorage.setItem("timer_isPlaying", "true");
    } else {
      localStorage.setItem("timer_elapsed", time);
      localStorage.setItem("timer_isPlaying", "false");
    }

    return () => clearInterval(interval);
  }, [isPlaying, time]);

  //EndGame
  const handleEndGame = async () => {
    try {
      await api.post(`/stopwatch/subout/${gameId}`); 
      await api.put(`/games/update-analysis-type/${gameId}`, { type: "Post" });// Update game type/status
      console.log(`Game ${gameId} ended. All players subbed out and analysis type set to Post Analysis.`);
      setIsPlaying(false); // stop the timer locally
    } catch (err) {
      console.error("Failed to end game:", err);
    }
  };


  //fetch team A info with teamId
  useEffect(() => {
    if (!teamId) return;

    api.get(`/teams/get/${teamId}`)
      .then((res) => {
        console.log("Fetched Team:", res.data);
        setTeamA({
          name: res.data.teamName,     // make sure your backend actually returns `name`
          players: []              // keep empty until you fetch players
        });
      })
      .catch((err) => {
        console.error("Failed to fetch team:", err);
      });
  }, [teamId]);

  useEffect(() => {
    if (!gameId) return;

    const fetchGameData = async () => {
      try {
        // Fetch the game data
        const gameRes = await api.get(`/games/get/${gameId}`);
        console.log("Fetched Game:", gameRes.data);

        const gameName = gameRes.data.gameName || ""; // Get the game name from the response

        // Extract the part after " vs " in the gameName
        const opponentName = gameName.split(' vs ')[1] || ''; // If " vs " is not found, return empty string

        // Set gameDetails with opponentName
        setGameDetails({
          ...gameRes.data,
          opponentName: opponentName, // Add opponentName to gameDetails
        });

        // Fetch the opponent stats
        const opponentRes = await api.get(`/basic-stats-var/get/by-game/${gameId}`);
        console.log("Opponent stats raw response:", opponentRes.data);
        console.log("Fetched Opponent Stats:", opponentRes.data);

        // Set the opponent stats
        setOpponenetStats(opponentRes.data);

      } catch (err) {
        console.error("Failed to fetch game data:", err);
      }
    };

    fetchGameData();

  }, [gameId]);


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
    console.log("Game Id: ", gameId);
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

  const handlePlayPause = async () => {
    try {
      if (!isPlaying) {
        // Resume timers
        await api.post(`/stopwatch/sub-in/${gameId}`);
        console.log("Backend stopwatches resumed for all subbed-in players.");
      } else {
        // Pause timers (Timeout)
        await api.post(`/stopwatch/timeout/${gameId}`);
        console.log("Backend stopwatches paused (timeout).");
      }

      // Toggle frontend state
      setIsPlaying(!isPlaying);

    } catch (err) {
      console.error("Failed to sync stopwatch state:", err);
    }
  };


  const handlePlayerClick = async (team, index) => {
    setSelectedRef({ team, index });

    if (team === "A") {
      const stat = teamABasicStats[index];
      setSelectedBasicStat(stat);
      setFormStats({ ...stat });
    } else if (team === "B") {
      try {
        const res = await api.get(`/basic-stats-var/get/by-game/${gameId}`);
        console.log("Opponent stats raw response:", res.data);

        // Accept BasicStatsVariationDTO (array) and use basicStatVarId
        let opponentStat = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!opponentStat || typeof opponentStat !== "object" || opponentStat.basicStatVarId == null) {
          alert("No opponent stats found for this game.");
          setShowModal(false);
          return;
        }
        setSelectedBasicStat(opponentStat);
        setFormStats({ ...opponentStat });
      } catch (err) {
        console.error("Failed to fetch enemy stats:", err);
        setShowModal(false);
      }
    }

    setShowModal(true);
  };


  const handlePlayersClick = (playerId) => {
    const stat = teamABasicStats.find(s => s.playerId === playerId);
    if (stat) {
      setSelectedBasicStat(stat);
      setFormStats({
        ...stat,
        basicStatId: stat.basicStatId,
        fname: stat.fname,
        lname: stat.lname,
        jerseyNum: stat.jerseyNum,
        playerId: stat.playerId
      });
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedRef(null)
  }

  //BasicStats Update
  useEffect(() => {
    if (selectedBasicStat) {
      setFormStats({ ...selectedBasicStat });
    }
  }, [selectedBasicStat]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormStats((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBasicStats = async () => {
    try {
      const payload = {
        basicStatId: formStats.basicStatId,
        twoPtAttempts: Number(formStats.twoPtAttempts),
        twoPtMade: Number(formStats.twoPtMade),
        threePtAttempts: Number(formStats.threePtAttempts),
        threePtMade: Number(formStats.threePtMade),
        ftAttempts: Number(formStats.ftAttempts),
        ftMade: Number(formStats.ftMade),
        assists: Number(formStats.assists),
        oFRebounds: Number(formStats.oFRebounds),
        dFRebounds: Number(formStats.dFRebounds),
        blocks: Number(formStats.blocks),
        steals: Number(formStats.steals),
        turnovers: Number(formStats.turnovers),
        pFouls: Number(formStats.pFouls),
        dFouls: Number(formStats.dFouls),
        plusMinus: Number(formStats.plusMinus),
        minutes: formStats.minutes || "00:00:00", // must be string "HH:mm:ss"
        gamePoints: Number(formStats.gamePoints),
        subbedIn: formStats.subbedIn,
        player: { playerId: formStats.playerId },
        game: { gameId: gameId }
      };

      const res = await api.put(`/basic-stats/put/${formStats.basicStatId}`, payload);
      // ...rest of your code...
    } catch (err) {
      console.error("Error updating stats:", err);
    }
  };
  const handleSaveStats = async () => {
    if (selectedRef?.team === "A") {
      await handleUpdateBasicStats();
    } else if (selectedRef?.team === "B") {
      await handleUpdateBasicStatsVariation();
    }
  };


  const handleStatUpdate = (statType, amount = 1) => {
    if (!formStats) return;

    const delta = (isAddMode ? 1 : -1) * amount;

    // Team A (BasicStats)
    if (formStats?.playerId) {
      setFormStats((prev) => {
        const updated = { ...prev };
        if (statType === "points") {
          updated.points = Math.max(0, (updated.points || 0) + delta);
        } else {
          updated[statType] = Math.max(0, (updated[statType] || 0) + delta);
        }
        return updated;
      });
      return;
    }

    // Team B (BasicStatsVariationDTO)
    if (formStats?.basicStatVarId) {
      setFormStats((prev) => {
        const updated = { ...prev };
        updated[statType] = Math.max(0, (updated[statType] || 0) + delta);
        return updated;
      });
      return;
    }
  };


  const handleSubstitute = async () => {
    try {
      if (gameId) {
        const res = await api.get(`/basic-stats/get/subbed-out/${gameId}`);
        console.log("Subbed-out players:", res.data);
        setSubbedOutPlayers(res.data);
      }
      setShowSubModal(true);
    } catch (err) {
      console.error("Failed to fetch subbed-out players:", err);
    }
  };

  const handleChooseSubstitute = async (benchBasicStatId) => {
    if (!selectedBasicStat) return;

    // Sub out the currently selected player (uses basicStatId)
    await api.post(`/stopwatch/${selectedBasicStat.basicStatId}/sub-out`);

    // Sub in the bench player (must also use basicStatId)
    await api.post(`/stopwatch/${benchBasicStatId}/sub-in`);

    // Refresh subbed-in list
    api.get(`/basic-stats/get/subbed-in/${gameId}`)
      .then((res) => {
        setTeamABasicStats(res.data);
        setShowSubModal(false);
        setShowModal(false);
      })
      .catch((err) => {
        console.error("Error fetching subbed-in players:", err);
      });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const currentPlayer =
    selectedRef && selectedRef.team === "A" && selectedRef.index != null
      ? teamA.players[selectedRef.index] || null
      : null;

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

  // GEt Points
  const getPoints = (stats) => {
    if (!stats) return 0;
    if (stats.basicStatVarId) {
      return (Number(stats.twoPtMade) * 2) + (Number(stats.threePtMade) * 3) + Number(stats.ftMade);
    }
    return Number(stats.points) || 0;
  };

  const getStat = (stats, key) => {
    if (!stats) return 0;
    return Number(stats[key]) || 0;
  };



  return (
    <div className="live-record-page">
      <CoachNavbar />

      <div className="live-record-container">
        {/* Header/Banner */}
        <div className="game-header">
          {/* Left: Teams + Date */}
          <div className="game-info-left">
            <div className="team-names">
              {gameDetails?.gameName}
            </div>
            <div className="game-date">{getCurrentDate()}</div>
          </div>

          {/* Center: Score */}
          <div className="game-info-center">
            <div className="score-display">
              <span className="team-score">{teamAScore}</span>
              <span className="score-separator">-</span>
              <span className="team-score">{teamBScore}</span>
            </div>
          </div>

          {/* Right: Timer + Controls */}
          <div className="game-info-right">
            <div className="timer-controls">
              <button
                className={`play-pause-btn ${isPlaying ? "playing" : "paused"}`}
                onClick={handlePlayPause}
              >
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
            {/* End Game Button */}
            <Button
              variant="contained"
              color="error"
              onClick={handleEndGame}
              sx={{
                marginLeft: 1,
                minWidth: "50px",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <StopCircle />
            </Button>
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
                      handlePlayersClick(stat.playerId)
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
            <h3 className="team-title">{gameDetails?.opponentName}</h3>
            <div className="players-grid">
              <div key={opponentStats?.basicStatVarId} className="player-card" onClick={() => handlePlayerClick('B', 0)}>
                <div className="jersey-number">Opponent Stats</div>
                <div className="player-name">sample</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: "2rem" }}>
          <button className="stat-btn" onClick={() => setShowFirstFiveModal(true)}>
            Add First Five
          </button>
        </div>
      </div>

      {/* Player Stats Modal */}
      {showModal && (currentPlayer || selectedBasicStat) && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container player-stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                #{currentPlayer?.jerseyNum || formStats?.jerseyNum}{" "}
                {currentPlayer?.lastName || formStats?.lname}
              </h2>
              <button className="close-button" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            <div className="modal-content">
              <div className="current-stats">
                <h4>
                  {formStats?.fname || ""} {formStats?.lname || ""} - Current Stats
                </h4>
                <div className="stats-display three-col">
                  <div className="stat-item">
                    <span className="stat-label">PTS:</span>
                    <span className="stat-value">{getPoints(formStats)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">STL:</span>
                    <span className="stat-value">{getStat(formStats, "steals")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">ORB:</span>
                    <span className="stat-value">{getStat(formStats, "oFRebounds")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">BLK:</span>
                    <span className="stat-value">{getStat(formStats, "blocks")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">DRB:</span>
                    <span className="stat-value">{getStat(formStats, "dFRebounds")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">TO:</span>
                    <span className="stat-value">{getStat(formStats, "turnovers")}</span>
                  </div>
                  <div className="stat-item ast">
                    <span className="stat-label">AST:</span>
                    <span className="stat-value">{getStat(formStats, "assists")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">2PA:</span>
                    <span className="stat-value">{getStat(formStats, "twoPtAttempts")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">2PM:</span>
                    <span className="stat-value">{getStat(formStats, "twoPtMade")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">3PA:</span>
                    <span className="stat-value">{getStat(formStats, "threePtAttempts")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">3PM:</span>
                    <span className="stat-value">{getStat(formStats, "threePtMade")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">FTA:</span>
                    <span className="stat-value">{getStat(formStats, "ftAttempts")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">FTM:</span>
                    <span className="stat-value">{getStat(formStats, "ftMade")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">PF:</span>
                    <span className="stat-value">{getStat(formStats, "pFouls")}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">DF:</span>
                    <span className="stat-value">{getStat(formStats, "dFouls")}</span>
                  </div>
                </div>
              </div>


              <div className="stat-controls">
                <h4>Record Stats</h4>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <button
                    className="close-modal-btn"
                    onClick={() => setIsAddMode((m) => !m)}
                  >
                    Mode: {isAddMode ? "Add" : "Subtract"}
                  </button>
                </div>

                <div className="stat-buttons four-col">
                  <button className="stat-btn" onClick={() => handleStatUpdate("oFRebounds")}>
                    {isAddMode ? "+" : "-"} ORB
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("dFRebounds")}>
                    {isAddMode ? "+" : "-"} DRB
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("assists")}>
                    {isAddMode ? "+" : "-"} AST
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("steals")}>
                    {isAddMode ? "+" : "-"} STL
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("blocks")}>
                    {isAddMode ? "+" : "-"} BLK
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("turnovers")}>
                    {isAddMode ? "+" : "-"} TO
                  </button>



                  <button className="stat-btn" onClick={() => handleStatUpdate("points", 1)}>
                    {isAddMode ? "+" : "-"} 1 PT
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("points", 2)}>
                    {isAddMode ? "+" : "-"} 2 PT
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("points", 3)}>
                    {isAddMode ? "+" : "-"} 3 PT
                  </button>



                  <button className="stat-btn" onClick={() => handleStatUpdate("twoPtAttempts")}>
                    {isAddMode ? "+" : "-"} 2PA
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("twoPtMade")}>
                    {isAddMode ? "+" : "-"} 2PM
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("threePtAttempts")}>
                    {isAddMode ? "+" : "-"} 3PA
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("threePtMade")}>
                    {isAddMode ? "+" : "-"} 3PM
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("ftAttempts")}>
                    {isAddMode ? "+" : "-"} FTA
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("ftMade")}>
                    {isAddMode ? "+" : "-"} FTM
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("pFouls")}>
                    {isAddMode ? "+" : "-"} PF
                  </button>
                  <button className="stat-btn" onClick={() => handleStatUpdate("dFouls")}>
                    {isAddMode ? "+" : "-"} DF
                  </button>
                </div>

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <button className="stat-btn" onClick={handleSaveStats}>
                    Save
                  </button>
                  <button
                    className="close-modal-btn"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => {
                      setShowModal(false);
                      setSelectedBasicStat(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="substitute-btn" onClick={handleSubstitute}>
                Substitute Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Substitute Selection Modal */}
      {showModal && showSubModal && (
        <div className="modal-overlay" onClick={() => setShowSubModal(false)}>
          <div className="modal-container player-stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Choose Substitute</h2>
              <button className="close-button" onClick={() => setShowSubModal(false)}>&times;</button>
            </div>
            <div className="modal-content">
              <div className="players-grid">
                {subbedOutPlayers.length === 0 ? (
                  <p>No players available to substitute in</p>
                ) : (
                  subbedOutPlayers.map((p) => (
                    <div
                      key={p.playerId}
                      className="player-card"
                      onClick={() => handleChooseSubstitute(p.basicStatId)}
                    >
                      <div className="jersey-number">#{p.jerseyNum}</div>
                      <div className="player-name">{p.fname} {p.lname}</div>
                    </div>
                  ))
                )}
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
            <div className="team-section">
              {/* Check if players are loading or empty */}
              {teamPlayers.length === 0 && teamId ? (
                <p>Loading players or no players found for team ID: {teamId}</p>
              ) : teamPlayers.length === 0 && !teamId ? (
                <p>Error: Team ID is missing from the URL. Please ensure the URL contains `?teamId=...`.</p>
              ) : (
                <div className="players-grid">
                  {/* Assuming API response uses playerId and lname */}
                  {teamPlayers.map((player) => {
                    const isSelected = selectedPlayers.includes(player.playerId);
                    return (
                      <div
                        key={player.playerId}
                        className={`player-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleCheckboxChange(player.playerId)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(player.playerId)}
                          onClick={(e) => e.stopPropagation()} // prevent double toggling
                        />

                        <div className="jersey-numnber">#{player.jerseyNum}</div>
                        <div className="player-name">{player.fname} {player.lname}</div>

                      </div>
                    );
                  })}

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

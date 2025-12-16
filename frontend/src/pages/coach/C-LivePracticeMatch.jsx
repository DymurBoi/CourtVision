"use client"
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CoachNavbar from "../../components/CoachNavbar"
import "../../styles/coach/C-LiveRecord.css"
import { api } from "../../utils/axiosConfig";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material"
import { StopCircle } from "lucide-react"
import { useNavigate } from "react-router-dom";

function CLivePracticeMatch() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem("enabled");
    return stored === "true";
  });
  const [gameDetails, setGameDetails] = useState();
  const [opponentStats, setOpponentStats] = useState();
  const [playByPlays, setPlayByPlays] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState(1);
  const [assistModal, setAsssistModal] = useState();
  const [pointModal, setPointModal] = useState();
  const [assistPlayers,setAssistPlayers]=useState([]);
  const [selectedUpdatePlayer, setSelectUpdatePlayer ] = useState();

  const [showModal, setShowModal] = useState(false)
  const [isAddMode, setIsAddMode] = useState(true) // true = add, false = subtract
  // Track which team and which player index is selected to always read fresh state
  const [selectedRef, setSelectedRef] = useState(null) // { team: 'A'|'B', index: number }
  const [showSubModal, setShowSubModal] = useState(false)
  //First Five Modal
  const [showFirstFiveModal, setShowFirstFiveModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedPlayersA, setSelectedPlayersA] = useState([]);
  const [selectedPlayersB, setSelectedPlayersB] = useState([]);
  const [firstPlayersA, setFirstPlayersA] = useState([]);
  const [firstPlayersB, setFirstPlayersB] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [showTeamSelectModal, setShowTeamSelectModal] = useState(false);
  const [teamActive, setTeamActive] = useState('A');
  //BasicStats Update
  const [selectedBasicStat, setSelectedBasicStat] = useState(null);
  const [formStats, setFormStats] = useState(null);

  //Scores
  const [teamAScoreLive, setTeamAScoreLive] = useState(0);
  const [teamBScoreLive, setTeamBScoreLive] = useState(0);

  //getting the teamid and gameid from the query string
  const location = useLocation();
  const { id: gameId } = useParams();
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("teamId");

  //BasicStats for team A or CITU
  const [teamABasicStats, setTeamABasicStats] = useState([]);
  const [teamBBasicStats, setTeamBBasicStats] = useState([]);
  //Score
  const [allTeamABasicStats, setAllTeamABasicStats] = useState([]);
  const [allTeamBBasicStats, setAllTeamBBasicStats] = useState([]);
  //Subbed Out Players
  const [subbedOutPlayers, setSubbedOutPlayers] = useState([]);
  // Sample team data - you can replace this with actual data from props or API
  const [teamA, setTeamA] = useState({
    name: "",
    players: []  // always exists
  });

  //UseEffect to control the Add First Five button visibility
  // Load confirmed first five from localStorage on mount
  // ✅ Load confirmed first five per team from localStorage on mount
  const initialConfirmedFirstFiveA =
    JSON.parse(localStorage.getItem("confirmedFirstFiveA")) || [];
  const initialConfirmedFirstFiveB =
    JSON.parse(localStorage.getItem("confirmedFirstFiveB")) || [];

  const [confirmedFirstFiveA, setConfirmedFirstFiveA] = useState([]);
  const [confirmedFirstFiveB, setConfirmedFirstFiveB] = useState([]);

  const [showAddFirstFiveButtonA, setShowAddFirstFiveButtonA] = useState(true);
  const [showAddFirstFiveButtonB, setShowAddFirstFiveButtonB] = useState(true);
  // ✅ Also track the combined "confirmedFirstFive" if needed
  const initialConfirmedFirstFive =
    JSON.parse(localStorage.getItem("confirmedFirstFive")) || [];
  const [confirmedFirstFive, setConfirmedFirstFive] = useState(initialConfirmedFirstFive);
  const [showAddFirstFiveButton, setShowAddFirstFiveButton] = useState(
    initialConfirmedFirstFive.length !== 5
  );

  // ✅ Sync localStorage when confirmedFirstFive changes
  useEffect(() => {
    localStorage.setItem("confirmedFirstFive", JSON.stringify(confirmedFirstFive));
    setShowAddFirstFiveButton(confirmedFirstFive.length !== 5);
  }, [confirmedFirstFive]);
  // show/hide Add First Five buttons per team

  //Timer
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  // New Timer Handles
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = ms % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${Math.floor(millis / 100)}`;
  }
  useEffect(() => {
    localStorage.setItem("enabled", enabled);
  }, [enabled]);

  //UseEffect for getting basicStats by game
  useEffect(() => {
    if (!gameId) return;

    const fetchStats = async () => {
      try {
        const teamARes = api.get(`/basic-stats/get/opp-false/${gameId}`),
          teamBRes = api.get(`/basic-stats/get/opp-true/${gameId}`);
        const playByPlayRes = await api.get(`/play-by-play/game/${gameId}`);
            if (playByPlayRes.status === 200) {
            console.log('PlayByPlay response:', playByPlayRes);
            setPlayByPlays(playByPlayRes.data);
        } else {
          throw new Error(`Failed to fetch play-by-play data: ${playByPlayRes.statusText}`);
        }
        setTeamABasicStats(teamARes.data || []);
        setTeamBBasicStats(teamBRes.data || []);
      } catch (err) {
        console.error("Failed to fetch team basic stats:", err);
        setTeamABasicStats([]);
        setTeamBBasicStats([]);
      }
    };

    fetchStats();
  }, [gameId]);


  //BasicStats Payload and logic for the first five players
  const handleConfirmFirstFiveModal = async () => {
    const selectedPlayers = teamActive === "A" ? selectedPlayersA : selectedPlayersB;
    const firstPlayers = teamActive === "A" ? firstPlayersA : firstPlayersB;
    if (teamActive === "A") {
      const updated = await api.get(`/basic-stats/get/subbed-in/opp-false/${gameId}`);
      setTeamABasicStats(updated.data);
      setConfirmedFirstFiveA(selectedPlayers.filter((p) =>
        firstPlayers.includes(p.playerId)
      ));
      const confirmedA = selectedPlayers.filter((p) => firstPlayers.includes(p.playerId));
      setConfirmedFirstFiveA(confirmedA);
    } else {
      const updated = await api.get(`/basic-stats/get/subbed-in/opp-true/${gameId}`);
      setTeamBBasicStats(updated.data);
      setConfirmedFirstFiveB(selectedPlayers.filter((p) =>
        firstPlayers.includes(p.playerId)
      ));
      const confirmedB = selectedPlayers.filter((p) => firstPlayers.includes(p.playerId));
      setConfirmedFirstFiveB(confirmedB);
    }

    setShowFirstFiveModal(false);

    if (firstPlayers.length !== 5) {
      alert("You must select exactly 5 players.");
      return;
    }

    try {
      // Build payload
      const statsList = selectedPlayers.map((player) => ({
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
        subbedIn: firstPlayers.includes(player.playerId),
        opponent: teamActive === "B",
        player: { playerId: player.playerId },
        game: { gameId: gameId },
      }));

      // Send to API
      const res = await api.post("/basic-stats/post/batch", statsList);
      console.log("Created BasicStats:", res.data);

      // Fetch updated stats


      // Update based on teamActive
      if (teamActive === "A") {
        setShowAddFirstFiveButtonA(false);
        const updated = await api.get(`/basic-stats/get/subbed-in/opp-false/${gameId}`);
        setTeamABasicStats(updated.data);
        setConfirmedFirstFiveA(selectedPlayers.filter((p) =>
          firstPlayers.includes(p.playerId)
        ));
      } else {
        setShowAddFirstFiveButtonB(false);
        const updated = await api.get(`/basic-stats/get/subbed-in/opp-true/${gameId}`);
        setTeamBBasicStats(updated.data);
        setConfirmedFirstFiveB(selectedPlayers.filter((p) =>
          firstPlayers.includes(p.playerId)
        ));
      }


      setShowFirstFiveModal(false);
    } catch (err) {
      console.error("Error creating BasicStats:", err);
    }
  };


  //Timer useEffect
  // --- On mount: restore timer state ---
  useEffect(() => {
    const savedStartTime = localStorage.getItem("timer_startTime");
    const savedElapsed = localStorage.getItem("timer_elapsed");
    const savedIsPlaying = localStorage.getItem("timer_isPlaying") === "true";

    if (savedIsPlaying && savedStartTime) {
      const elapsedSinceStart = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      setTime((savedElapsed ? parseInt(savedElapsed, 10) : 0) + elapsedSinceStart);
      setIsPlaying(true);
    } else if (savedElapsed) {
      setTime(parseInt(savedElapsed, 10));
    }
  }, []);

  // --- When timer state changes: persist values ---
  useEffect(() => {
    let interval;

    if (isPlaying) {
      const startTime = Date.now() - time * 1000;
      localStorage.setItem("timer_startTime", startTime.toString());
      localStorage.setItem("timer_isPlaying", "true");

      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          localStorage.setItem("timer_elapsed", newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      localStorage.setItem("timer_isPlaying", "false");
      localStorage.setItem("timer_elapsed", time.toString());
      // ❌ don't remove startTime — keep it for restoration
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  //EndGame
  const handleEndGame = async () => {
  try {
    // Sub out all players first
    await api.post(`/stopwatch/subout/${gameId}`);

    // Fetch latest subbed-in basic-stats for both sides (practice match uses opp-false / opp-true)
    const [teamARes, teamBRes] = await Promise.all([
      api.get(`/basic-stats/get/opp-false/${gameId}`),
      api.get(`/basic-stats/get/opp-true/${gameId}`)
    ]);

    const latestTeamAStats = Array.isArray(teamARes.data) ? teamARes.data : [];
    const latestTeamBStats = Array.isArray(teamBRes.data) ? teamBRes.data : [];

    const latestTeamAScore = latestTeamAStats.reduce((sum, s) => sum + (Number(s.gamePoints) || 0), 0);
    const latestTeamBScore = latestTeamBStats.reduce((sum, s) => sum + (Number(s.gamePoints) || 0), 0);

    // Prevent ending the game if the scores are tied
    if (latestTeamAScore === latestTeamBScore) {
      alert("The game cannot end in a tie. Please resolve the score before ending the game.");
      return;
    }

    // Update game status and final score using the computed latest totals
    await api.put(`/games/update-analysis-type/${gameId}`, { type: "Post" });
    await api.put(`/games/update-final-score/${gameId}`, { finalScore: `${latestTeamAScore}-${latestTeamBScore}` });

    await api.post(`/stopwatch/resetGame`);
    console.log(`Game ${gameId} ended. All players subbed out and analysis type set to Post Analysis.`);

    // Clear confirmed first-five for both teams and localStorage keys
    setConfirmedFirstFive([]);
    setShowAddFirstFiveButton(true);
    localStorage.removeItem("confirmedFirstFive");

    setConfirmedFirstFiveA([]);
    setConfirmedFirstFiveB([]);
    setShowAddFirstFiveButtonA(true);
    setShowAddFirstFiveButtonB(true);
    setEnabled(false);
    localStorage.removeItem("enabled");
    localStorage.removeItem("confirmedFirstFiveA");
    localStorage.removeItem("confirmedFirstFiveB");

    setIsPlaying(false); // stop the timer locally
    navigate(`/coach/game-details/${gameId}?teamId=${teamId}`);
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
        setOpponentStats(opponentRes.data);
        const res = await api.get(`/stopwatch/state/${gameId}`);
        setRunning(res.data.running);
        setIsPlaying(res.data.running);
      } catch (err) {
        console.error("Failed to fetch game data:", err);
      }
    };

    fetchGameData();

  }, [gameId]);

  // Compute Team B score dynamically based on opponentStats
  const teamBScore = Array.isArray(opponentStats)
    ? opponentStats.reduce((sum, stat) => sum + (stat.gamePoints || 0), 0)
    : opponentStats?.[0]?.gamePoints || 0;


  useEffect(() => {
    if (!gameId) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/basic-stats-var/get/by-game/${gameId}`);
        setOpponentStats(res.data);
      } catch (err) {
        console.error("Failed to auto-refresh opponent stats:", err);
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [gameId]);

  // Fetch team players with teamId
  //Fetch players when First Five modal opens
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
    else if (showTeamSelectModal && teamId) {
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
  }, [showFirstFiveModal, teamId, showTeamSelectModal]);


  //Fetch BasicStats for Team A when gameId and teamId are available
  useEffect(() => {
    if (!gameId) return;

    const fetchData = async () => {
      try {
        const [teamASubRes, teamBSubRes, teamARes, teamBRes] = await Promise.all([
          api.get(`/basic-stats/get/subbed-in/opp-false/${gameId}`),
          api.get(`/basic-stats/get/subbed-in/opp-true/${gameId}`),
          api.get(`/basic-stats/get/opp-false/${gameId}`),
          api.get(`/basic-stats/get/opp-true/${gameId}`)
        ]);

        const teamAData = teamARes.data || [];
        const teamBData = teamBRes.data || [];
        const teamASubData = teamASubRes.data || [];
        const teamBSubData = teamBSubRes.data || [];

        setTeamABasicStats(teamASubData);
        setTeamBBasicStats(teamBSubData);
        setAllTeamABasicStats(teamAData);
        setAllTeamBBasicStats(teamBData);

        // ✅ Show the "Add First Five" button if no data
        setShowAddFirstFiveButtonA(teamAData.length === 0);
        setShowAddFirstFiveButtonB(teamBData.length === 0);

        console.log("team a:", teamAData);
        console.log("team b:", teamBData);

      } catch (err) {
        console.error("Failed to fetch team basic stats:", err);
      }
    };

    fetchData();
  }, [gameId]);

  const handlePlayersClick = (playerId) => {
    if (!enabled) return;
    const statA = teamABasicStats.find(s => s.playerId === playerId);
    const statB = teamBBasicStats.find(s => s.playerId === playerId);
    if (statA) {
      setSelectedRef({ team: "A", index: teamABasicStats.indexOf(statA) }); // <-- Add this line!
      setSelectedBasicStat(statA);
      setFormStats({
        ...statA,
        basicStatId: statA.basicStatId,
        fname: statA.fname,
        lname: statA.lname,
        jerseyNum: statA.jerseyNum,
        playerId: statA.playerId
      });
      setShowModal(true);
    } else if (statB) {
      setSelectedRef({ team: "B", index: teamBBasicStats.indexOf(statB) });
      setSelectedBasicStat(statB);
      setFormStats({
        ...statB,
        basicStatId: statB.basicStatId,
        fname: statB.fname,
        lname: statB.lname,
        jerseyNum: statB.jerseyNum,
        playerId: statB.playerId
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

  const handleUpdateBasicStats = async () => {
    console.log("Called");
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
        subbedIn: formStats.subbedIn,
        player: { playerId: formStats.playerId },
        game: { gameId: gameId }
      };

      const res = await api.put(`/basic-stats/put/${formStats.basicStatId}`, payload);
      console.log("Updated BasicStats:", res.data);

      const updatedA = await api.get(`/basic-stats/get/subbed-in/opp-false/${gameId}`);
      setTeamABasicStats(updatedA.data);

      const updatedB = await api.get(`/basic-stats/get/subbed-in/opp-true/${gameId}`);
      setTeamBBasicStats(updatedB.data);

      try {
        const playByPlayRes = await api.get(`/play-by-play/game/${gameId}`);
            if (playByPlayRes.status === 200) {
            console.log('PlayByPlay response:', playByPlayRes);
            setPlayByPlays(playByPlayRes.data);
        } else {
          throw new Error(`Failed to fetch play-by-play data: ${playByPlayRes.statusText}`);
        }
        const A = await api.get(`/basic-stats/get/opp-false/${gameId}`);
        const B = await api.get(`/basic-stats/get/opp-true/${gameId}`);
        setAllTeamABasicStats(A.data);
        setAllTeamBBasicStats(B.data);
      } catch (e) {
        console.warn("Could not refresh all basic stats after update:", e);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error updating stats:", err);
    }
  };

  const handleSaveStats = async () => {
    console.log("handleSaveStats called, selectedRef:", selectedRef);
    if (selectedRef?.team === "A") {
      console.log("Calling handleUpdateBasicStats");
      await handleUpdateBasicStats();
    } else if (selectedRef?.team === "B") {
      console.log("Calling handleUpdateBasicStatsVariation");
      await handleUpdateBasicStats();
    } else {
      console.log("No team selected!");
    }
  };
  
  const handleCancelStat = async () =>{
    const A = await api.get(`/basic-stats/get/opp-false/${gameId}`);
    const B = await api.get(`/basic-stats/get/opp-true/${gameId}`);
    setAllTeamABasicStats(A.data);
    setAllTeamBBasicStats(B.data);
    setShowModal(false);
    setSelectedBasicStat(null);
  }

 const handleStatUpdate = (statType, amount = 1) => {
  if (!formStats) return;

  const delta = (isAddMode ? 1 : -1) * amount;

  // 🏀 TEAM A — BasicStats
  if (formStats?.playerId) {
    const updatedPlayer = { ...formStats };

    // Handle linked stats (made + attempt)
    if (statType === "threePtMade") {
      updatedPlayer.threePtMade = Math.max(0, (updatedPlayer.threePtMade || 0) + delta);
      if (isAddMode) updatedPlayer.threePtAttempts = (updatedPlayer.threePtAttempts || 0) + 1;
    } else if (statType === "twoPtMade") {
      updatedPlayer.twoPtMade = Math.max(0, (updatedPlayer.twoPtMade || 0) + delta);
      if (isAddMode) updatedPlayer.twoPtAttempts = (updatedPlayer.twoPtAttempts || 0) + 1;
    } else if (statType === "ftMade") {
      updatedPlayer.ftMade = Math.max(0, (updatedPlayer.ftMade || 0) + delta);
      if (isAddMode) updatedPlayer.ftAttempts = (updatedPlayer.ftAttempts || 0) + 1;
    } else {
      // other stats like rebounds, assists, etc.
      updatedPlayer[statType] = Math.max(0, (updatedPlayer[statType] || 0) + delta);
    }

    // 🔁 Recalculate gamePoints for Team A
    updatedPlayer.gamePoints =
      (Number(updatedPlayer.twoPtMade) * 2) +
      (Number(updatedPlayer.threePtMade) * 3) +
      Number(updatedPlayer.ftMade);

    setFormStats(updatedPlayer);

    // 💯 Update Team A live score only
    if (selectedRef.team === "A") {
      const newTotal = teamABasicStats.reduce((sum, stat) => {
        if (stat.playerId === updatedPlayer.playerId) {
          return sum + (Number(updatedPlayer.gamePoints) || 0);
        }
        return sum + (Number(stat.gamePoints) || 0);
      }, 0);

      setTeamAScoreLive(newTotal);
    }
  }

  // 🏀 TEAM B — BasicStatsVariationDTO
  if (formStats?.basicStatVarId) {
    setFormStats((prev) => {
      const updated = { ...prev };
      if (statType === "bPoints") {
        updated[statType] = Math.max(0, (updated[statType] || 0) + delta);
      } else {
        updated[statType] = Math.max(0, (updated[statType] || 0) + delta);
      }
      return updated;
    });

    // 🔁 Recalculate gamePoints for Team B
    const updatedPlayerForB = { ...formStats };
    updatedPlayerForB.gamePoints =
      (Number(updatedPlayerForB.twoPtMade) * 2) +
      (Number(updatedPlayerForB.threePtMade) * 3) +
      Number(updatedPlayerForB.ftMade);

    // 💯 Update Team B live score only
    if (selectedRef.team === "B") {
      const newTeamBTotal = teamBBasicStats.reduce((sum, stat) => {
        if (stat.playerId === updatedPlayerForB.playerId) {
          return sum + (Number(updatedPlayerForB.gamePoints) || 0);
        }
        return sum + (Number(stat.gamePoints) || 0);
      }, 0);

      setTeamBScoreLive(newTeamBTotal);  // Update Team B's live score
    }
  }
};

  // Automatically refresh Team A total every 0.5 seconds
  useEffect(() => {
    const intervalA = setInterval(() => {
      const totalA = allTeamABasicStats.reduce((sum, stat) => sum + (Number(stat.gamePoints) || 0), 0);
      setTeamAScoreLive(totalA);
    }, 500);

    return () => clearInterval(intervalA);
  }, [allTeamABasicStats]);

  // Automatically refresh Team B total every 0.5 seconds
  useEffect(() => {
    const intervalB = setInterval(() => {
      const totalB = allTeamBBasicStats.reduce((sum, stat) => sum + (Number(stat.gamePoints) || 0), 0);
      setTeamBScoreLive(totalB);
    }, 500);

    return () => clearInterval(intervalB);
  }, [allTeamBBasicStats]);

  const handleSubstitute = async () => {
    try {
      if (!selectedRef || !gameId) return;

      let res;
      if (selectedRef.team === "A") {
        res = await api.get(`/basic-stats/get/subbed-out/opp-false/${gameId}`);
      } else if (selectedRef.team === "B") {
        res = await api.get(`/basic-stats/get/subbed-out/opp-true/${gameId}`);
      }

      console.log(`Subbed-out players for Team ${selectedRef.team}:`, res.data);
      setSubbedOutPlayers(res.data);
      setShowSubModal(true);
    } catch (err) {
      console.error("Failed to fetch subbed-out players:", err);
    }
  };

  const handleChooseSubstitute = async (benchBasicStatId) => {
    if (!selectedBasicStat || !selectedRef || !gameId) return;

    try {
      // Sub out the selected player
      await api.post(`/stopwatch/${selectedBasicStat.basicStatId}/sub-out`);

      // Sub in the new player
      await api.post(`/stopwatch/${benchBasicStatId}/sub-in`);

      const [subbedOut, subbedIn] = await Promise.all([
        api.get(`/basic-stats/get/${selectedBasicStat.basicStatId}`),
        api.get(`/basic-stats/get/${benchBasicStatId}`)
      ]);

      const payload = {
      gameId: gameId,
      playerId: selectedUpdatePlayer,
      message: `${subbedOut.data.fname} ${subbedOut.data.lname} subbed in for ${subbedIn.data.fname} ${subbedIn.data.lname}`,
      timestamp: new Date().toISOString(),
    };
    await api.post('/play-by-play', payload);
      const playByPlayRes = await api.get(`/play-by-play/game/${gameId}`);
      if (playByPlayRes.status === 200) {
        setPlayByPlays(playByPlayRes.data);
      }
      // Refresh based on team
      let res;
      if (selectedRef.team === "A") {
        res = await api.get(`/basic-stats/get/subbed-in/opp-false/${gameId}`);
        setTeamABasicStats(res.data);
      } else if (selectedRef.team === "B") {
        res = await api.get(`/basic-stats/get/subbed-in/opp-true/${gameId}`);
        setTeamBBasicStats(res.data);
      }

      console.log(`Updated subbed-in players for Team ${selectedRef.team}:`, res.data);

      setShowSubModal(false);
      setShowModal(false);
    } catch (err) {
      console.error("Error choosing substitute:", err);
    }
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


  const handleFirstFiveCheckbox = (playerId) => {
    const setter = teamActive === "A" ? setFirstPlayersA : setFirstPlayersB;
    const selectedFirst = teamActive === "A" ? firstPlayersA : firstPlayersB;

    setter((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId); // deselect
      } else if (prev.length < 5) {
        return [...prev, playerId]; // add
      } else {
        alert("You can only select 5 players!");
        return prev;
      }
    });
  };

  const handleCheckBoxTeam = (player) => {
    const setter = teamActive === "A" ? setSelectedPlayersA : setSelectedPlayersB;

    setter((prev) => {
      // Check if this player is already selected by comparing playerId
      const exists = prev.some((p) => p.playerId === player.playerId);

      if (exists) {
        // Remove player
        return prev.filter((p) => p.playerId !== player.playerId);
      } else {
        // Add player
        return [...prev, player];
      }
    });
  };

  const getStat = (stats, key) => {
    if (!stats) return 0;
    return Number(stats[key]) || 0;
  };


  //Timer New Handles
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const fetchState = async () => {
    const res = await api.get(`/stopwatch/state/${gameId}`);
    setElapsedTime(res.data.elapsedTimeMillis);
    setRunning(res.data.running);
  };

  useEffect(() => {
    fetchState();
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1000);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStart = async () => {
    if (teamABasicStats.length !== 5 && teamBBasicStats.length !== 5) {
      alert("You must select exactly 5 players.");
      return;
    }
    setIsPlaying(true);
    await api.post(`/stopwatch/sub-in/${gameId}`);
    setRunning(true);
    setEnabled(true);
  };

  const handleStop = async () => {
    if (teamABasicStats.length !== 5 && teamBBasicStats.length !== 5) {
      alert("You must select exactly 5 players.");
      return;
    }
    setIsPlaying(false);
    await api.post(`/stopwatch/timeout/${gameId}`);
    setRunning(false);
  };

    const handlePointsSelect = (points) => {
      setSelectedPoints(points);
    };

const handleAssist = async (basicStatId) => {
  try {
    if (!gameId) return;

    let res;
    if (selectedRef.team === "A") {
      res = await api.get(`/basic-stats/get/subbed-in/opp-false/${gameId}`);
    } else if (selectedRef.team === "B") {
      res = await api.get(`/basic-stats/get/subbed-in/opp-true/${gameId}`);
    }
    
    const updatedAssistPlayers = res.data.filter(player => player.basicStatId !== basicStatId);
    setAssistPlayers(updatedAssistPlayers);

    // Set the player you want to update (this player is from Team A or Team B)
    setSelectUpdatePlayer(basicStatId);

    // Open the assist modal
    setAsssistModal(true);
  } catch (err) {
    console.error("Failed to fetch subbed-out players:", err);
  }
};


const handleAssistUpdate = async (basicStatId) => {
  try {
    const [currentStat, assistStat] = await Promise.all([
      api.get(`/basic-stats/get/${selectedUpdatePlayer}`),
      api.get(`/basic-stats/get/${basicStatId}`)
    ]);

    // Increment the assist count
    const updatedCurrentStat = {
      ...currentStat.data,
      assists: currentStat.data.assists + 1,
    };

    // Prepare the assist stat update based on selectedPoints
    let updatedAssistStat = { ...assistStat.data };
    let pointVal = "three";
    if (selectedPoints === 3) {
      pointVal = "three point shot";
      updatedAssistStat = {
        ...updatedAssistStat,
        threePtAttempts: updatedAssistStat.threePtAttempts + 1,
        threePtMade: updatedAssistStat.threePtMade + 1
      };
    } else if (selectedPoints === 2) {
      pointVal = "two point shot";
      updatedAssistStat = {
        ...updatedAssistStat,
        twoPtAttempts: updatedAssistStat.twoPtAttempts + 1,
        twoPtMade: updatedAssistStat.twoPtMade + 1
      };
    } else if (selectedPoints === 1) {
      updatedAssistStat = {
        ...updatedAssistStat,
        ftAttempts: updatedAssistStat.ftAttempts + 1,
        ftMade: updatedAssistStat.ftMade + 1
      };
    }

    // Perform both updates in parallel
    const updatedCurrentStatRes = await api.put(`/basic-stats/put/${selectedUpdatePlayer}`, updatedCurrentStat);
    const updatedAssistStatRes = await api.put(`/basic-stats/put/${assistStat.data.basicStatId}`, updatedAssistStat);

    // Create play-by-play entry
    const payload = {
      gameId: gameId,
      playerId: selectedUpdatePlayer,
      message: `${updatedCurrentStat.fname} ${updatedCurrentStat.lname}'s assisted ${updatedAssistStat.fname} ${updatedAssistStat.lname}'s ${pointVal}`,
      timestamp: new Date().toISOString(),
    };
    await api.post('/play-by-play', payload);

    // Refresh stats only for the updated team
    const updatedA = await api.get(`/basic-stats/get/subbed-in/opp-false/${gameId}`);
      setTeamABasicStats(updatedA.data);

      const updatedB = await api.get(`/basic-stats/get/subbed-in/opp-true/${gameId}`);
      setTeamBBasicStats(updatedB.data);

      try {
        const playByPlayRes = await api.get(`/play-by-play/game/${gameId}`);
            if (playByPlayRes.status === 200) {
            console.log('PlayByPlay response:', playByPlayRes);
            setPlayByPlays(playByPlayRes.data);
        } else {
          throw new Error(`Failed to fetch play-by-play data: ${playByPlayRes.statusText}`);
        }
        const A = await api.get(`/basic-stats/get/opp-false/${gameId}`);
        const B = await api.get(`/basic-stats/get/opp-true/${gameId}`);
        setAllTeamABasicStats(A.data);
        setAllTeamBBasicStats(B.data);
      } catch (e) {
        console.warn("Could not refresh all basic stats after update:", e);
      }

    // Close the modal dialogs
    setShowModal(false);
    setAsssistModal(false);
  } catch (err) {
    console.error("Error updating stats:", err);
    alert("An error occurred while updating the stats. Please try again.");
  }
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
              <span className="team-score">{teamAScoreLive}</span>
              <span className="score-separator">-</span>
              <span className="team-score">{teamBScoreLive}</span>
            </div>
          </div>

          {/* Right: Timer + Controls */}
          <div className="game-info-right">
            <div className="timer-controls">
              <button
                className={`play-pause-btn ${isPlaying ? "playing" : "paused"}`}
                onClick={running ? handleStop : handleStart}
              >
                {isPlaying ? (
                  // PAUSE
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  // PLAY
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

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
          {/* TEAM A */}
          <div className="team-section">
            <h3 className="team-title">{teamA?.name || "Team A"}</h3>
              <div className="players-grid">
                {teamABasicStats.length === 0 ? (
                  <div className="player-card no-players">No players subbed in</div>
                ) : (
                  teamABasicStats.map((stat) => (
                    <div
                      key={stat.playerId}
                      className={`player-card selected ${!enabled ? "disabled" : ""}`}
                      onClick={() => enabled && handlePlayersClick(stat.playerId)}
                    >
                      <div className="jersey-number">#{stat.jerseyNum}</div>
                      <div className="player-name">
                        {stat.fname} {stat.lname}
                      </div>
                    </div>
                  ))
                )}
              </div>

            {/* Add First Five Button for TEAM A */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1.5rem",
              }}
            >
              {showAddFirstFiveButtonA && (
                <Button
                  className="stat-btn"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowFirstFiveModal(true);
                    setTeamActive('A');
                  }}
                >
                  Add First Five (Team A)
                </Button>
              )}

              {showAddFirstFiveButtonA && (
                <Button
                  className="stat-btn"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowTeamSelectModal(true);
                    setTeamActive('A');
                  }}
                >
                  Select Players (Team A)
                </Button>
              )}
            </div>
          </div>

          {/* TEAM B */}
          <div className="team-section">
            <h3 className="team-title">{teamA?.name || "Team B"}</h3>
            <div className="players-grid">
              {teamBBasicStats.length === 0 ? (
                <div className="player-card no-players">No players subbed in</div>
              ) : (
                teamBBasicStats.map((stat) => (
                  <div
                    key={stat.playerId}
                      className={`player-card selected ${!enabled ? "disabled" : ""}`}
                      onClick={() => enabled && handlePlayersClick(stat.playerId)}
                  >
                    <div className="jersey-number">#{stat.jerseyNum}</div>
                    <div className="player-name">
                      {stat.fname} {stat.lname}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add First Five Button for TEAM B */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1.5rem",
              }}
            >
              {showAddFirstFiveButtonB && (
                <Button
                  className="stat-btn"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowFirstFiveModal(true);
                    setTeamActive('B');
                  }}
                >
                  Add First Five (Team B)
                </Button>
              )}

              {showAddFirstFiveButtonB && (
                <Button
                  className="stat-btn"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowTeamSelectModal(true);
                    setTeamActive('B');
                  }}
                >
                  Select Players (Team B)
                </Button>
              )}
            </div>
          </div>
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
                    <span className="stat-label">Points:</span>
                    <span className="stat-value">{getStat(formStats, "points")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("threePtAttempts")}>
                    <span className="stat-label">3 Point Attempts:</span>
                    <span className="stat-value">{getStat(formStats, "threePtAttempts")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("threePtMade")}>
                    <span className="stat-label">3 Points Made:</span>
                    <span className="stat-value">{getStat(formStats, "threePtMade")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("twoPtAttempts")}>
                    <span className="stat-label">2 Point Attempts:</span>
                    <span className="stat-value">{getStat(formStats, "twoPtAttempts")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("twoPtMade")}>
                    <span className="stat-label">2 Points Made:</span>
                    <span className="stat-value">{getStat(formStats, "twoPtMade")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("ftAttempts")}>
                    <span className="stat-label">Free Throw Attempts:</span>
                    <span className="stat-value">{getStat(formStats, "ftAttempts")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("ftMade")}>
                    <span className="stat-label">Free Throws Made:</span>
                    <span className="stat-value">{getStat(formStats, "ftMade")}</span>
                  </div>
                  <div className="stat-item ast" onClick={() => isAddMode ? handleAssist(formStats.basicStatId) : handleStatUpdate("assists")}>
                    <span className="stat-label">Assists:</span>
                    <span className="stat-value">{getStat(formStats, "assists")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("steals")}>
                    <span className="stat-label">Steals:</span>
                    <span className="stat-value">{getStat(formStats, "steals")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("blocks")}>
                    <span className="stat-label">Blocks:</span>
                    <span className="stat-value">{getStat(formStats, "blocks")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("turnovers")}>
                    <span className="stat-label">Turnovers:</span>
                    <span className="stat-value">{getStat(formStats, "turnovers")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("oFRebounds")}>
                    <span className="stat-label">Offensive Rebounds:</span>
                    <span className="stat-value">{getStat(formStats, "oFRebounds")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("dFRebounds")}>
                    <span className="stat-label">Defensive Rebounds:</span>
                    <span className="stat-value">{getStat(formStats, "dFRebounds")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("pFouls")}>
                    <span className="stat-label">Personal Fouls:</span>
                    <span className="stat-value">{getStat(formStats, "pFouls")}</span>
                  </div>
                  <div className="stat-item" onClick={() => handleStatUpdate("dFouls")}>
                    <span className="stat-label">Defensive Fouls:</span>
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
                  <button className="substitute-btn" onClick={handleSubstitute}>
                    Substitute Player
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
                  <button className="save-modal-btn" onClick={() => {
                    handleSaveStats();
                    setShowModal(false);

                  }}>
                    Save
                  </button>
                  <button
                    className="close-modal-btn"
                    onClick={() => {
                      handleCancelStat();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Assist Modal */}
       {showModal && assistModal && (
        <div className="modal-overlay" onClick={() => setAsssistModal(false)}>
          <div className="modal-container player-stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record Assist</h2>
              <button className="close-button" onClick={() => setAsssistModal(false)}>&times;</button>
            </div>
            <div className="modal-content">
              {/* Step 1: Points Selection */}
              <div className="assist-workflow-section">
                <div className="workflow-step">
                  <span className="step-number">1</span>
                  <h4>Select Shot Type</h4>
                </div>
                <div className="points-selection-enhanced">
                  {[
                    { points: 3, label: "3-Point Shot" },
                    { points: 2, label: "2-Point Shot" },
                  ].map(({ points, label }) => (
                    <button
                      key={points}
                      className={`points-btn-enhanced ${selectedPoints === points ? 'selected' : ''}`}
                      onClick={() => handlePointsSelect(points)}
                    >
                      <span className="point-value">{points}</span>
                      <span className="point-label">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Player Selection */}
              <div className="assist-workflow-section">
                <div className="workflow-step">
                  <span className="step-number">2</span>
                  <h4>Select Player Who Scored</h4>
                </div>
                {assistPlayers.length === 0 ? (
                  <div className="no-players-message">
                    <p>⚠️ No other players available on court</p>
                  </div>
                ) : (
                  <div className="players-grid assist-players-grid">
                    {assistPlayers.map((p) => (
                      <div
                        key={p.playerId}
                        className="player-card assist-player-card"
                        onClick={() => handleAssistUpdate(p.basicStatId)}
                      >
                        <div className="jersey-number">#{p.jerseyNum}</div>
                        <div className="player-name">{p.fname} {p.lname}</div>
                        <div className="assist-action-hint">
                          +1 AST • +{selectedPoints} PTS
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem", paddingBottom: "1rem" }}>
              <button className="close-modal-btn single" onClick={() => setAsssistModal(false)}>Cancel</button>
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
          <div
            className="modal-container player-stats-modal wide-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Select First Five Players (Team {teamActive})</h2>
              <button
                className="close-button"
                onClick={() => setShowFirstFiveModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="team-section">
              {((teamActive === "A" ? selectedPlayersA : selectedPlayersB).length === 0) ? (
                <p>No players selected yet for Team {teamActive}.</p>
              ) : (
                <div className="players-grid">
                  {(teamActive === "A" ? selectedPlayersA : selectedPlayersB).map(
                    (player) => {
                      const selectedFirstPlayers =
                        teamActive === "A" ? firstPlayersA : firstPlayersB;
                      const isChecked = selectedFirstPlayers.includes(player.playerId);

                      return (
                        <div
                          key={player.playerId}
                          className={`player-card ${isChecked ? "selected" : ""}`}
                          onClick={() => handleFirstFiveCheckbox(player.playerId)}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                          />
                          <div className="player-info">
                            #{player.jerseyNum} {player.fname} {player.lname}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
              <button
                className="save-modal-btn"
                onClick={handleConfirmFirstFiveModal}
              >
                Confirm First Five
              </button>
              <button
                className="close-modal-btn"
                onClick={() => setShowFirstFiveModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showTeamSelectModal && (
        <div className="modal-overlay" onClick={() => setShowTeamSelectModal(false)}>
          <div
            className="modal-container player-stats-modal wide-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Select Players (Team {teamActive})</h2>
              <button
                className="close-button"
                onClick={() => setShowTeamSelectModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="team-section">
              {/* Check if players are loading or empty */}
              {teamPlayers.length === 0 && teamId ? (
                <p>Loading players or no players found for team ID: {teamId}</p>
              ) : teamPlayers.length === 0 && !teamId ? (
                <p>
                  Error: Team ID is missing from the URL. Please ensure the URL
                  contains `?teamId=...`.
                </p>
              ) : (
                <div className="players-grid">
                  {teamPlayers.map((player) => {
                    // Decide which team’s selectedPlayers to use
                    const selectedPlayers =
                      teamActive === "A" ? selectedPlayersA : selectedPlayersB;
                    const isSelected = selectedPlayers.includes(player.playerId);

                    return (
                      <div
                        key={player.playerId}
                        className={`player-card ${(teamActive === "A"
                          ? selectedPlayersA
                          : selectedPlayersB
                        ).some((p) => p.playerId === player.playerId)
                          ? "selected"
                          : ""
                          }`}
                        onClick={() => handleCheckBoxTeam(player)} // Pass full player object
                      >
                        <input
                          type="checkbox"
                          checked={
                            (teamActive === "A"
                              ? selectedPlayersA
                              : selectedPlayersB
                            ).some((p) => p.playerId === player.playerId)
                          }
                          readOnly
                        />
                        <div className="jersey-number">#{player.jerseyNum}</div>
                        <div className="player-name">{player.fname} {player.lname}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
              <button
                className="save-modal-btn"
                onClick={() => {
                  setShowTeamSelectModal(false);
                }}
              >
                Confirm Selection
              </button>
              <button
                className="close-modal-btn"
                onClick={() => setShowTeamSelectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Play-by-Play Section */}
      <div className="play-by-play-section">
        <div className="play-by-play-header">
          <h3>Game Activity Log</h3>
          <span className="play-count">{playByPlays.length} {playByPlays.length === 1 ? 'event' : 'events'}</span>
        </div>
        
        <div className="play-by-play-container">
          {playByPlays.length === 0 ? (
            <div className="no-plays-message">
              <p>📋 No game activity recorded yet</p>
              <span>Actions will appear here as the game progresses</span>
            </div>
          ) : (
            <div className="play-by-play-feed">
              {playByPlays.slice().reverse().map((play, index) => (
                <div key={index} className="play-item">
                  <div className="play-timestamp">
                    {play.timestamp ? new Date(play.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : '--:--:--'}
                  </div>
                  <div className="play-content">
                    <div className="play-message">{play.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CLivePracticeMatch
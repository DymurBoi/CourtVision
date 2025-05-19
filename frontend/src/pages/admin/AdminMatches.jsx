"use client";

import { useState } from "react";
import "../../styles/coach/C-Matches.css";

function AdminMatches() {
  const [matches, setMatches] = useState([
    {
      id: 1,
      homeTeam: "CIT-U",
      awayTeam: "USJR",
      result: "W",
      score: "78-65",
      date: "05/15/2023",
    },
    {
      id: 2,
      homeTeam: "CIT-U",
      awayTeam: "USC",
      result: "L",
      score: "62-70",
      date: "05/22/2023",
    },
  ]);

  const handleDeleteMatch = (matchId) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      setMatches(matches.filter((match) => match.id !== matchId));
    }
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Basketball Matches</h1>
        <p>Manage all basketball matches</p>
      </div>

      <div className="matches-container">
        {matches.map((match) => (
          <div className="match-item" key={match.id}>
            <div className="teams">
              {match.homeTeam} VS {match.awayTeam}
            </div>
            <div className={`result ${match.result === "W" ? "win" : "loss"}`}>{match.result}</div>
            <div className="points">{match.score}</div>
            <div className="date">{match.date}</div>
            <button className="delete-button" onClick={() => handleDeleteMatch(match.id)}>
              Delete Match
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminMatches;

"use client";

import { useState } from "react";
import "../../styles/coach/C-Requests.css";

function AdminRequests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      playerName: "Michael Jordan",
      type: "Physical Record",
      date: "2023-03-15",
    },
    {
      id: 2,
      playerName: "LeBron James",
      type: "Team Invite",
      date: "2023-03-18",
    },
  ]);

  const handleDeleteRequest = (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setRequests(requests.filter((request) => request.id !== requestId));
    }
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Player Requests</h1>
        <p>Manage all player requests</p>
      </div>

      <div className="requests-container">
        {requests.map((request) => (
          <div className="request-item" key={request.id}>
            <div className="player-name">{request.playerName}</div>
            <div className="request-description">{request.type}</div>
            <div className="request-date">{request.date}</div>
            <button className="delete-button" onClick={() => handleDeleteRequest(request.id)}>
              Delete Request
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminRequests;

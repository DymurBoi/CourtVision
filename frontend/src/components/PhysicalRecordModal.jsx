"use client"
import { useState, useEffect } from "react"
import "../styles/PhysicalRecordModal.css"
import { api } from "../utils/axiosConfig"

function PhysicalRecordModal({ request, onClose, onApprove, onReject }) {
  const [playerData, setPlayerData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhysicalRecord();
  }, []);

  const fetchPhysicalRecord = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const coachId = userId.split('_')[1];

      if (!coachId || isNaN(coachId)) {
        setError("Invalid coach ID format. Please login again.");
        setLoading(false);
        return;
      }

      console.log("Fetching requests for coach ID:", coachId);

      const playerResponse = await api.get(`/physical-records/get/by-player/${request.playerId}`);
      console.log("Fetched player physical data:", playerResponse.data);

      setPlayerData(playerResponse.data);  // Directly use the object as it is
    } catch (err) {
      console.error("Error fetching player physical data:", err);
      setError("Failed to fetch physical data");
    }

    setLoading(false);
  };

  if (!request) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content physical-record-modal">
        <div className="modal-header">
          <h2>Physical Update Request</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="request-info">
            <div className="request-info-row">
              <span className="info-label">Player:</span>
              <span className="info-value">{request.playerName}</span>
            </div>
            <div className="request-info-row">
              <span className="info-label">Team:</span>
              <span className="info-value">{request.teamName}</span>
            </div>
            <div className="request-info-row">
              <span className="info-label">Date Requested:</span>
              <span className="info-value">{formatDate(request.dateRequested)}</span>
            </div>
            <div className="request-info-row">
              <span className="info-label">Status:</span>
              <span className={`status-badge status-${request.requestStatus}`}>
                {request.requestStatus === 0
                  ? "Pending"
                  : request.requestStatus === 1
                  ? "Approved"
                  : "Rejected"}
              </span>
            </div>
          </div>

          <div className="physical-records-details">
            <h3>Physical Records</h3>
            <div className="physical-records-grid-container">
              {/* Display both records side by side */}
              <div className="physical-records-grid">
                <h4>Updated Record</h4>
                <div className="record-detail">
                  <span className="record-label">Height</span>
                  <span className="record-value">{request?.height || "N/A"} cm</span>
                </div>
                <div className="record-detail">
                  <span className="record-label">Weight</span>
                  <span className="record-value">{request.weight || "N/A"} kg</span>
                </div>
                <div className="record-detail">
                  <span className="record-label">Wingspan</span>
                  <span className="record-value">{request.wingspan || "N/A"} cm</span>
                </div>
                <div className="record-detail">
                  <span className="record-label">Vertical</span>
                  <span className="record-value">{request.vertical || "N/A"} cm</span>
                </div>
              </div>

              <div className="physical-records-grid">
                <h4>Old Record</h4>
                {playerData ? (
                  <>
                    <div className="record-detail">
                      <span className="record-label">Height</span>
                      <span className="record-value">{playerData.height || "N/A"} cm</span>
                    </div>
                    <div className="record-detail">
                      <span className="record-label">Weight</span>
                      <span className="record-value">{playerData.weight || "N/A"} kg</span>
                    </div>
                    <div className="record-detail">
                      <span className="record-label">Wingspan</span>
                      <span className="record-value">{playerData.wingspan || "N/A"} cm</span>
                    </div>
                    <div className="record-detail">
                      <span className="record-label">Vertical</span>
                      <span className="record-value">{playerData.vertical || "N/A"} cm</span>
                    </div>
                  </>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {request.requestStatus === 0 && (
          <div className="modal-footer">
            <button className="modal-button approve-button" onClick={onApprove}>
              Approve
            </button>
            <button className="modal-button reject-button" onClick={onReject}>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhysicalRecordModal;

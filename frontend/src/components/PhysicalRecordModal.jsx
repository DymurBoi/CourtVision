"use client"

import React from "react"
import "../styles/components/PhysicalRecordModal.css"

function PhysicalRecordModal({ request, onClose, onApprove, onReject }) {
  if (!request) return null;

  // Format date to a more readable format
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
            <h3>Physical Measurements</h3>
            <div className="physical-records-grid">
              <div className="record-detail">
                <span className="record-label">Height</span>
                <span className="record-value">{request.height} cm</span>
              </div>
              <div className="record-detail">
                <span className="record-label">Weight</span>
                <span className="record-value">{request.weight} kg</span>
              </div>
              <div className="record-detail">
                <span className="record-label">Wingspan</span>
                <span className="record-value">{request.wingspan} cm</span>
              </div>
              <div className="record-detail">
                <span className="record-label">Vertical</span>
                <span className="record-value">{request.vertical} cm</span>
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
  )
}

export default PhysicalRecordModal


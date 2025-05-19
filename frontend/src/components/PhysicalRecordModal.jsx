"use client"

import { useState } from "react"
import "../styles/Modal.css"

function PhysicalRecordModal({ request, onClose }) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = () => {
    setIsConfirming(true)
    // Simulate API call
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Physical Record</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-content">
          <div className="player-info">
            <h3>{request.playerName}</h3>
            <span className="date">{request.date}</span>
          </div>

          <div className="records-container">
            <div className="record-column">
              <h4>Old Record</h4>
              <div className="record-item">
                <span className="record-label">Height</span>
                <span className="record-value">{request.details.oldRecord.height} cm</span>
              </div>
              <div className="record-item">
                <span className="record-label">Weight</span>
                <span className="record-value">{request.details.oldRecord.weight} kg</span>
              </div>
              <div className="record-item">
                <span className="record-label">Wingspan</span>
                <span className="record-value">{request.details.oldRecord.wingspan} cm</span>
              </div>
              <div className="record-item">
                <span className="record-label">Vertical</span>
                <span className="record-value">{request.details.oldRecord.vertical} cm</span>
              </div>
            </div>

            <div className="record-column">
              <h4>Updated Record</h4>
              <div className="record-item">
                <span className="record-label">Height</span>
                <span className="record-value">{request.details.updatedRecord.height} cm</span>
              </div>
              <div className="record-item">
                <span className="record-label">Weight</span>
                <span className="record-value">{request.details.updatedRecord.weight} kg</span>
              </div>
              <div className="record-item">
                <span className="record-label">Wingspan</span>
                <span className="record-value">{request.details.updatedRecord.wingspan} cm</span>
              </div>
              <div className="record-item">
                <span className="record-label">Vertical</span>
                <span className="record-value">{request.details.updatedRecord.vertical} cm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="confirm-button" onClick={handleConfirm} disabled={isConfirming}>
            {isConfirming ? "Processing..." : "Confirm Update"}
          </button>
          <button className="reject-button" onClick={onClose}>
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default PhysicalRecordModal


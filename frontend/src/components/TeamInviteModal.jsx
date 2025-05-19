import { useState } from "react"
import "../styles/Modal.css"

function TeamInviteModal({ request, onClose }) {
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
          <h2>Team Invite</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-content">
          <div className="player-info">
            <h3>{request.playerName}</h3>
          </div>

          <div className="team-invite-content">
            <p>
              Player wants to join <span className="team-name">{request.team}</span>
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button className="confirm-button" onClick={handleConfirm} disabled={isConfirming}>
            {isConfirming ? "Processing..." : "Approve Request"}
          </button>
          <button className="reject-button" onClick={onClose}>
            Reject Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamInviteModal


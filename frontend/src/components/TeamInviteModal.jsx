import { useState } from "react"
import "../styles/Modal.css"

function TeamInviteModal({ request, onClose, onApprove, onReject }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await onApprove()
    } catch (error) {
      console.error("Error approving request:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      await onReject()
    } catch (error) {
      console.error("Error rejecting request:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Team Join Request</h2>
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

        {request.requestStatus === 0 && (
          <div className="modal-actions">
            <button className="confirm-button" onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Approve Request"}
            </button>
            <button className="reject-button" onClick={handleReject} disabled={isProcessing}>
              Reject Request
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamInviteModal


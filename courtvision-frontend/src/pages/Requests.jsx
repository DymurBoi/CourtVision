import { useState } from "react"
import PhysicalRecordModal from "../components/PhysicalRecordModal"
import TeamInviteModal from "../components/TeamInviteModal"
import "../styles/Requests.css"

// Sample request data
const requestsData = [
  {
    id: 1,
    playerName: "Michael Jordan",
    type: "Physical Record",
    date: "2023-03-15",
    details: {
      oldRecord: { height: 198, weight: 98, wingspan: 213, vertical: 122 },
      updatedRecord: { height: 198, weight: 96, wingspan: 213, vertical: 124 },
    },
  },
  { id: 2, playerName: "LeBron James", type: "Team Invite", team: "CIT-U High School Team" },
  {
    id: 3,
    playerName: "Stephen Curry",
    type: "Physical Record",
    date: "2023-03-18",
    details: {
      oldRecord: { height: 191, weight: 84, wingspan: 193, vertical: 91 },
      updatedRecord: { height: 191, weight: 85, wingspan: 193, vertical: 94 },
    },
  },
  { id: 4, playerName: "Kevin Durant", type: "Team Invite", team: "CIT-U College Team" },
  {
    id: 5,
    playerName: "Kobe Bryant",
    type: "Physical Record",
    date: "2023-03-20",
    details: {
      oldRecord: { height: 198, weight: 96, wingspan: 214, vertical: 116 },
      updatedRecord: { height: 198, weight: 94, wingspan: 214, vertical: 118 },
    },
  },
  { id: 6, playerName: "Giannis Antetokounmpo", type: "Team Invite", team: "CIT-U Elementary Team" },
  {
    id: 7,
    playerName: "Luka Doncic",
    type: "Physical Record",
    date: "2023-03-22",
    details: {
      oldRecord: { height: 201, weight: 104, wingspan: 218, vertical: 86 },
      updatedRecord: { height: 201, weight: 102, wingspan: 218, vertical: 89 },
    },
  },
  { id: 8, playerName: "Jayson Tatum", type: "Team Invite", team: "CIT-U College Team" },
]

function Requests() {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showPhysicalModal, setShowPhysicalModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    if (request.type === "Physical Record") {
      setShowPhysicalModal(true)
    } else {
      setShowTeamModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowPhysicalModal(false)
    setShowTeamModal(false)
    setSelectedRequest(null)
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Player Requests</h1>
        <p>Review and manage player requests</p>
      </div>

      <div className="requests-container">
        <div className="requests-list">
          <div className="request-header">
            <div className="player-name-header">Player Name</div>
            <div className="description-header">Description</div>
            <div className="action-header">Action</div>
          </div>

          {requestsData.map((request) => (
            <div className="request-item" key={request.id}>
              <div className="player-name">{request.playerName}</div>
              <div className="request-description">{request.type}</div>
              <div className="request-action">
                <button className="view-button" onClick={() => handleViewRequest(request)}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPhysicalModal && selectedRequest && (
        <PhysicalRecordModal request={selectedRequest} onClose={handleCloseModal} />
      )}

      {showTeamModal && selectedRequest && <TeamInviteModal request={selectedRequest} onClose={handleCloseModal} />}
    </main>
  )
}

export default Requests


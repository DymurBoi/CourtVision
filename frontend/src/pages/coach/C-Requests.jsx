import { useState, useEffect } from "react"
import PhysicalRecordModal from "../../components/PhysicalRecordModal"
import TeamInviteModal from "../../components/TeamInviteModal"
import "../../styles/coach/C-Requests.css"
import { api } from "../../utils/axiosConfig"

function Requests() {
  const [joinRequests, setJoinRequests] = useState([])
  const [physicalRequests, setPhysicalRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showPhysicalModal, setShowPhysicalModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [activeTab, setActiveTab] = useState('join') // 'join' or 'physical'
  
  // Status mapping for better display
  const statusLabels = {
    0: "Pending",
    1: "Approved",
    2: "Rejected"
  }

  useEffect(() => {
    fetchRequests()
  }, [])
  
  const fetchRequests = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setError("User ID not found. Please login again.")
        setLoading(false)
        return
      }
      
      // Extract the numeric part from "COACH_X" format
      const coachId = userId.split('_')[1]
      
      if (!coachId || isNaN(coachId)) {
        setError("Invalid coach ID format. Please login again.")
        setLoading(false)
        return
      }
      
      console.log("Fetching requests for coach ID:", coachId)
      
      // Fetch join requests
      try {
        const joinResponse = await api.get(`/join-requests/by-coach/${coachId}`)
        console.log("Fetched join requests:", joinResponse.data)
        
        if (Array.isArray(joinResponse.data)) {
          setJoinRequests(joinResponse.data)
        } else {
          console.error("Expected array but got:", typeof joinResponse.data)
        }
      } catch (err) {
        console.error("Error fetching join requests:", err)
      }
      
      // Fetch physical update requests
      try {
        const physicalResponse = await api.get(`/physical-update-requests/coach/${coachId}`)
        console.log("Fetched physical update requests:", physicalResponse.data)
        
        if (Array.isArray(physicalResponse.data)) {
          setPhysicalRequests(physicalResponse.data)
        } else {
          console.error("Expected array but got:", typeof physicalResponse.data)
        }
      } catch (err) {
        console.error("Error fetching physical update requests:", err)
      }
      
      setLoading(false)
    } catch (err) {
      console.error("Error fetching requests:", err)
      setError(`Failed to fetch requests: ${err.message}`)
      setLoading(false)
    }
  }

  const handleViewRequest = (request, type) => {
    console.log(`Viewing ${type} request:`, request)
    setSelectedRequest(request)
    if (type === 'join') {
      setShowTeamModal(true)
    } else {
      setShowPhysicalModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowPhysicalModal(false)
    setShowTeamModal(false)
    setSelectedRequest(null)
  }
  
  const handleApproveJoinRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      console.log("Approving join request:", selectedRequest);
      
      // Validate that we have all the required data
      if (!selectedRequest.playerId || !selectedRequest.teamId) {
        console.error("Missing required data for team assignment:", 
          {playerId: selectedRequest.playerId, teamId: selectedRequest.teamId});
        alert("Cannot approve request: Missing player or team data");
        return;
      }
      
      // Make sure numeric values are numbers and not strings
      const playerId = Number(selectedRequest.playerId);
      const teamId = Number(selectedRequest.teamId);
      const requestId = selectedRequest.requestId;
      
      console.log("Processing approval for request ID:", requestId);
      
      // Step 1: Update the request status to approved (1)
      console.log("Step 1: Updating request status to approved");
      const approvalResponse = await api.put(`/join-requests/${requestId}`, {
        ...selectedRequest,
        requestStatus: 1 // 1 for approved
      });
      
      console.log("Step 1 response:", approvalResponse);
      
      // Step 2: Directly use player-to-team assignment endpoint as a backup
      console.log("Step 2: Directly assigning player to team");
      const directAssignmentResponse = await api.put(`/players/${playerId}/team/${teamId}`);
      
      console.log("Step 2 response:", directAssignmentResponse);
      
      // Update the request in the local state
      setJoinRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 1 } 
            : req
        )
      );
      
      // Close the modal
      handleCloseModal();
      
      // Show success message
      alert("Join request approved successfully. The player has been assigned to the team.");
      
      // Refresh the requests list to ensure we have the latest data
      setTimeout(() => fetchRequests(), 1000);
      
    } catch (error) {
      console.error("Error approving join request:", error);
      alert("Failed to approve request: " + (error.response?.data?.message || error.message));
    }
  };
  
  const handleApprovePhysicalRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      console.log("Approving physical update request:", selectedRequest);
      
      const approvalPayload = {
        ...selectedRequest,
        requestStatus: 1 // 1 for approved
      };
      
      console.log("Sending physical update approval with payload:", approvalPayload);
      
      const response = await api.put(`/physical-update-requests/${selectedRequest.requestId}`, approvalPayload);
      
      console.log("Physical update approval response:", response);
      
      // Update the request in the local state
      setPhysicalRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 1 } 
            : req
        )
      );
      
      // Close the modal
      handleCloseModal();
      
      // Show success message
      alert("Physical update request approved successfully. The player's physical records have been updated.");
      
      // Refresh the requests list
      setTimeout(() => fetchRequests(), 1000);
      
    } catch (error) {
      console.error("Error approving physical update request:", error);
      alert("Failed to approve request: " + (error.response?.data?.message || error.message));
    }
  };
  
  const handleRejectJoinRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      console.log("Rejecting join request:", selectedRequest.requestId);
      const response = await api.put(`/join-requests/${selectedRequest.requestId}`, {
        ...selectedRequest,
        requestStatus: 2 // 2 for rejected
      });
      
      console.log("Rejection response:", response.data);
      
      // Update the request in the local state
      setJoinRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 2 } 
            : req
        )
      );
      
      // Close the modal
      handleCloseModal();
      
      // Show success message
      alert("Join request rejected successfully");
    } catch (error) {
      console.error("Error rejecting join request:", error);
      alert("Failed to reject request: " + (error.response?.data?.message || error.message));
    }
  };
  
  const handleRejectPhysicalRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      console.log("Rejecting physical update request:", selectedRequest.requestId);
      const response = await api.put(`/physical-update-requests/${selectedRequest.requestId}`, {
        ...selectedRequest,
        requestStatus: 2 // 2 for rejected
      });
      
      console.log("Physical update rejection response:", response.data);
      
      // Update the request in the local state
      setPhysicalRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 2 } 
            : req
        )
      );
      
      // Close the modal
      handleCloseModal();
      
      // Show success message
      alert("Physical update request rejected successfully");
    } catch (error) {
      console.error("Error rejecting physical update request:", error);
      alert("Failed to reject request: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Player Requests</h1>
        <p>Review and manage player requests</p>
      </div>

      <div className="requests-tabs">
        <button 
          className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          Team Join Requests
        </button>
        <button 
          className={`tab-button ${activeTab === 'physical' ? 'active' : ''}`}
          onClick={() => setActiveTab('physical')}
        >
          Physical Update Requests
        </button>
      </div>

      <div className="requests-container">
        {activeTab === 'join' && (
          <div className="requests-list">
            <div className="request-header">
              <div className="player-name-header">Player Name</div>
              <div className="description-header">Description</div>
              <div className="status-header">Status</div>
              <div className="action-header">Action</div>
            </div>

            {joinRequests.length > 0 ? (
              joinRequests.map((request) => (
                <div className="request-item" key={request.requestId}>
                  <div className="player-name">{request.playerName || "Unknown Player"}</div>
                  <div className="request-description">Team Join Request - {request.teamName || "Unknown Team"}</div>
                  <div className="request-status">
                    <span className={`status-badge status-${request.requestStatus}`}>
                      {statusLabels[request.requestStatus] || "Unknown"}
                    </span>
                  </div>
                  <div className="request-action">
                    <button 
                      className="view-button" 
                      onClick={() => handleViewRequest(request, 'join')}
                      disabled={request.requestStatus !== 0}
                    >
                      {request.requestStatus === 0 ? 'Review' : 'View'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-requests">No team join requests found.</div>
            )}
          </div>
        )}

        {activeTab === 'physical' && (
          <div className="requests-list">
            <div className="request-header">
              <div className="player-name-header">Player Name</div>
              <div className="description-header">Description</div>
              <div className="status-header">Status</div>
              <div className="action-header">Action</div>
            </div>

            {physicalRequests.length > 0 ? (
              physicalRequests.map((request) => (
                <div className="request-item" key={request.requestId}>
                  <div className="player-name">{request.playerName || "Unknown Player"}</div>
                  <div className="request-description">Physical Stats Update Request</div>
                  <div className="request-status">
                    <span className={`status-badge status-${request.requestStatus}`}>
                      {statusLabels[request.requestStatus] || "Unknown"}
                    </span>
                  </div>
                  <div className="request-action">
                    <button 
                      className="view-button" 
                      onClick={() => handleViewRequest(request, 'physical')}
                      disabled={request.requestStatus !== 0}
                    >
                      {request.requestStatus === 0 ? 'Review' : 'View'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-requests">No physical update requests found.</div>
            )}
          </div>
        )}
      </div>

      {showPhysicalModal && selectedRequest && (
        <PhysicalRecordModal 
          request={selectedRequest} 
          onClose={handleCloseModal}
          onApprove={handleApprovePhysicalRequest}
          onReject={handleRejectPhysicalRequest}
        />
      )}

      {showTeamModal && selectedRequest && (
        <TeamInviteModal 
          request={{
            ...selectedRequest,
            team: selectedRequest.teamName // Format for the modal
          }}
          onClose={handleCloseModal}
          onApprove={handleApproveJoinRequest}
          onReject={handleRejectJoinRequest}
        />
      )}
    </main>
  )
}

export default Requests


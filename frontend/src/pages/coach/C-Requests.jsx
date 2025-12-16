import { useState, useEffect } from "react"
import PhysicalRecordModal from "../../components/PhysicalRecordModal"
import TeamInviteModal from "../../components/TeamInviteModal"
import "../../styles/coach/C-Requests.css"
import { api } from "../../utils/axiosConfig"

function Requests() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [physicalRequests, setPhysicalRequests] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPhysicalModal, setShowPhysicalModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'physical'
  
  // Status mapping for better display
  const statusLabels = {
    0: "Pending",
    1: "Approved",
    2: "Rejected"
  };

  // Fetch requests for the selected team
  const fetchRequestsForTeam = async (teamId) => {
    if (!teamId) return;
    try {
      // Fetch join requests
      const joinResponse = await api.get(`/join-requests/by-team/${teamId}`);
      if (Array.isArray(joinResponse.data)) setJoinRequests(joinResponse.data);

      // Fetch physical update requests
      const physicalResponse = await api.get(`/physical-update-requests/team/${teamId}`);
      if (Array.isArray(physicalResponse.data)) setPhysicalRequests(physicalResponse.data);

    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(`Failed to fetch requests: ${err.message}`);
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const coachId = userId.split("_")[1];
        if (!coachId) return;

        const response = await api.get(`/teams/get/by-coach/${coachId}`);
        const teamsData = response.data || [];

        setTeams(teamsData);
        if (!selectedTeamId && teamsData.length > 0) {
          setSelectedTeamId(teamsData[0].teamId);
          localStorage.setItem("selectedTeamId", teamsData[0].teamId);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      fetchRequestsForTeam(selectedTeamId);
      const intervalId = setInterval(() => {
        if (!showPhysicalModal && !showTeamModal) {
          fetchRequestsForTeam(selectedTeamId);
        }
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [selectedTeamId, showPhysicalModal, showTeamModal]);

  const handleViewRequest = (request, type) => {
    console.log(`Viewing ${type} request:`, request);
    setSelectedRequest(request);
    if (type === 'join') {
      setShowTeamModal(true);
    } else {
      setShowPhysicalModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowPhysicalModal(false);
    setShowTeamModal(false);
    setSelectedRequest(null);
  };

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

      const playerId = Number(selectedRequest.playerId);
      const teamId = Number(selectedRequest.teamId);
      const requestId = selectedRequest.requestId;
      
      // Step 1: Update the request status to approved (1)
      const approvalResponse = await api.put(`/join-requests/accept/${requestId}`, {
        ...selectedRequest
      });
      
      // Update the request in the local state
      setJoinRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 1 } 
            : req
        )
      );

      // Close the modal and show success message
      handleCloseModal();
      alert("Join request approved successfully. The player has been assigned to the team.");

      // Refresh the requests list
      setTimeout(() => fetchRequestsForTeam(selectedTeamId), 1000);
      
    } catch (error) {
      console.error("Error approving join request:", error);
      alert("Failed to approve request: " + (error.response?.data?.message || error.message));
    }
  };

  const handleApprovePhysicalRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const approvalPayload = {
        ...selectedRequest,
        requestStatus: 1 // 1 for approved
      };
      
      const response = await api.put(`/physical-update-requests/${selectedRequest.requestId}`, approvalPayload);
      
      // Update the request in the local state
      setPhysicalRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 1 } 
            : req
        )
      );
      
      // Close the modal and show success message
      handleCloseModal();
      alert("Physical update request approved successfully.");

      // Refresh the requests list
      setTimeout(() => fetchRequestsForTeam(selectedTeamId), 1000);
      
    } catch (error) {
      console.error("Error approving physical update request:", error);
      alert("Failed to approve request: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectJoinRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const response = await api.put(`/join-requests/${selectedRequest.requestId}`, {
        ...selectedRequest,
        requestStatus: 2 // 2 for rejected
      });
      
      // Update the request in the local state
      setJoinRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 2 } 
            : req
        )
      );
      
      // Close the modal and show success message
      handleCloseModal();
      alert("Join request rejected successfully");
    } catch (error) {
      console.error("Error rejecting join request:", error);
      alert("Failed to reject request: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectPhysicalRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const response = await api.put(`/physical-update-requests/${selectedRequest.requestId}`, {
        ...selectedRequest,
        requestStatus: 2 // 2 for rejected
      });
      
      // Update the request in the local state
      setPhysicalRequests(prevRequests => 
        prevRequests.map(req => 
          req.requestId === selectedRequest.requestId 
            ? { ...req, requestStatus: 2 } 
            : req
        )
      );
      
      // Close the modal and show success message
      handleCloseModal();
      alert("Physical update request rejected successfully");
    } catch (error) {
      console.error("Error rejecting physical update request:", error);
      alert("Failed to reject request: " + (error.response?.data?.message || error.message));
    }
  };

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Player Requests</h1>
        <p>Review and manage player requests</p>
      </div>
      <div className="team-dropdown">
      <label htmlFor="team-select">Select Team:</label>
      <select
        id="team-select"
        value={selectedTeamId || ""}
        onChange={(e) => {
          const teamId = Number(e.target.value);
          setSelectedTeamId(teamId);
          localStorage.setItem("selectedTeamId", teamId);
          fetchRequestsForTeam(teamId); // fetch requests for the selected team
        }}
        className="team-select"
      >
        {teams.map((team) => (
          <option key={team.teamId} value={team.teamId}>
            {team.teamName}
          </option>
        ))}
      </select>
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
              <div>Player Name</div>
              <div>Description</div>
              <div>Status</div>
              <div>Action</div>
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
              <div>Player Name</div>
              <div>Description</div>
              <div>Status</div>
              <div>Action</div>
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
            team: selectedRequest.teamName
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


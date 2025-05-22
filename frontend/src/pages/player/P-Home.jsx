"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import "../../styles/player/P-Home.css"

function PHome() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [playerData, setPlayerData] = useState({
    id: null,
    fname: "",
    lname: "",
    email: "",
    jerseyNum: "",
    position: "",
    team: null
  })
  const [availableTeams, setAvailableTeams] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Simple function to fetch player data - wrapped in useCallback to prevent dependency issues
  const fetchPlayerData = useCallback(async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Extract the numeric ID from the format "PLAYER_123"
      let playerId = user.id;
      
      if (typeof playerId === 'string' && playerId.startsWith("PLAYER_")) {
        playerId = playerId.substring(7); // Remove "PLAYER_" prefix
      }
      
      // Make sure ID is a number if the backend expects it
      if (playerId && !isNaN(Number(playerId))) {
        playerId = Number(playerId);
      }
      
      console.log(`Fetching data for player ID: ${playerId}`);
      
      // Add cache busting for API requests to prevent stale data
      const timestamp = new Date().getTime();
      
      // Log additional debug info about authorization
      console.log("Authorization debug:");
      console.log("- User object:", user);
      console.log("- Auth token exists:", !!localStorage.getItem("authToken"));
      console.log("- User ID from localStorage:", localStorage.getItem("userId"));
      
      // Use api client which was working before
      const response = await api.get(`/players/get/${playerId}?t=${timestamp}`);
      const data = response.data;
      
      if (!data) {
        console.log("No player data found");
        setLoading(false);
        return;
      }
      
      console.log("Fetched player data:", data);
      console.log("Player team data:", data.team);
      
      // Update player data state with what came from server
      setPlayerData({
        id: data.playerId,
        fname: data.fname || "",
        lname: data.lname || "",
        email: data.email || "",
        jerseyNum: data.jerseyNum,
        position: data.position || "Not assigned",
        team: data.team
      });
      
      // Fetch pending requests
      try {
        const requestsResponse = await api.get(`/join-requests/by-player/${playerId}?t=${timestamp}`);
        if (requestsResponse.data && Array.isArray(requestsResponse.data)) {
          const pendingReqs = requestsResponse.data.map(req => ({
            requestId: req.requestId,
            teamId: req.teamId,
            status: req.requestStatus
          }));
          setPendingRequests(pendingReqs);
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching player data:', error);
      setLoading(false);
    }
  }, [user]);

  // Fetch data when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchPlayerData();
  }, [user, refreshTrigger, fetchPlayerData]);

  // Fetch available teams only when needed
  useEffect(() => {
    // Only fetch teams if the player doesn't have a team
    if (!playerData.team) {
      console.log("Player has no team - fetching available teams");
      
      api.get("/teams/get/all")
        .then(res => {
          console.log("Teams API response:", res);
          if (res.data && Array.isArray(res.data)) {
            const teams = res.data.map(team => ({
              id: team.teamId,
              name: team.teamName,
              description: team.teamName + " team", 
              coach: team.coaches && team.coaches.length > 0
                ? team.coaches.map(c => c.fname + ' ' + c.lname).join(', ')
                : "No coach assigned",
              coachId: team.coaches && team.coaches.length > 0 ? team.coaches[0].coachId : null
            }));
            setAvailableTeams(teams);
          }
        })
        .catch(err => {
          console.error("Failed to fetch teams:", err);
          setAvailableTeams([]);
        });
    }
  }, [playerData.team]);

  // Fetch team members when player has a team
  useEffect(() => {
    if (playerData.team && playerData.team.teamId) {
      api.get(`/players/get/by-team/${playerData.team.teamId}`)
        .then(response => {
          const members = response.data.map(player => ({
            id: player.playerId,
            firstName: player.fname,
            lastName: player.lname,
            jerseyNumber: player.jerseyNum || 0,
            position: player.position || "Unknown",
            avatar: player.fname ? player.fname.charAt(0) : "P"
          }));
          setTeamMembers(members);
        })
        .catch(error => {
          console.error("Failed to fetch team members:", error);
          setTeamMembers([]);
        });
    }
  }, [playerData.team]);

  // Add a manual refresh button for the user
  const handleManualRefresh = () => {
    console.log("Manual refresh triggered");
    setRefreshTrigger(prev => prev + 1);
  };

  const handleApplyClick = (team) => {
    setSelectedTeam(team);
    setShowApplyModal(true);
  };

  const handleApplyConfirm = async () => {
    if (!playerData.id || !selectedTeam.id || !selectedTeam.coachId) {
      console.error('Missing required data:', { 
        playerId: playerData.id, 
        teamId: selectedTeam.id, 
        coachId: selectedTeam.coachId 
      });
      alert('Missing required data. Please try again.');
      return;
    }

    try {
      // Log the exact data we're sending
      console.log("Sending join request with data:", {
        playerId: Number(playerData.id),
        teamId: selectedTeam.id,
        coachId: selectedTeam.coachId
      });
      
      // Revert back to axios API client which was working before
      const response = await api.post('/join-requests', {
        playerId: Number(playerData.id),
        teamId: selectedTeam.id,
        coachId: selectedTeam.coachId
      });
      
      if (response.status === 200) {
        // Add to pending requests
        setPendingRequests(prev => [...prev, { 
          teamId: selectedTeam.id,
          status: 0 // 0 = pending
        }]);
        setShowApplyModal(false);
        alert('Your request has been sent to the coach for approval.');
        
        // Refresh data to ensure UI is updated
        handleManualRefresh();
      }
    } catch (error) {
      console.error('Failed to send join request:', error);
      alert('Failed to send join request. Please try again.');
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return <div className="loading">Loading player data...</div>
  }

  // DYNAMIC RENDERING: If player has no team, show team selection view
  if (!playerData.team) {
    return (
      <main className="main-content">
        <div className="player-welcome first-login">
          <div className="player-avatar">
            <span>{playerData.fname ? playerData.fname.charAt(0) : "P"}</span>
          </div>
          <div className="player-welcome-text">
            <h1>Welcome, {playerData.fname}</h1>
            <p>Please select a team to join</p>
          </div>
          <button 
            className="refresh-button" 
            onClick={handleManualRefresh}
            title="Refresh to check if your request is approved"
          >
            Refresh
          </button>
        </div>

        <div className="available-teams-section">
          <h2>Available Teams ({availableTeams.length})</h2>
          
          {availableTeams.length > 0 ? (
            <div className="available-teams-grid">
              {availableTeams.map((team) => {
                const isPending = pendingRequests.some(req => req.teamId === team.id);
                
                return (
                  <div className="available-team-card" key={team.id}>
                    <div className="team-banner college"></div>
                    <div className="team-content">
                      <h3>{team.name}</h3>
                      <p>{team.description}</p>
                      <div className="team-meta">
                        <div className="meta-item">
                          <span className="meta-label">Coach:</span>
                          <span className="meta-value">{team.coach}</span>
                        </div>
                      </div>
                      {isPending ? (
                        <div className="application-status pending">Request pending approval...</div>
                      ) : (
                        <button 
                          className="apply-button" 
                          onClick={() => handleApplyClick(team)}
                        >
                          Apply for this team
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-teams-message">
              <p>No available teams found. Please contact an administrator.</p>
            </div>
          )}
        </div>

        {/* Apply Confirmation Modal */}
        {showApplyModal && (
          <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Team Application</h2>
                <button className="close-button" onClick={() => setShowApplyModal(false)}>
                  &times;
                </button>
              </div>

              <div className="modal-content">
                <p>
                  Are you sure you want to apply for <strong>{selectedTeam?.name}</strong>?
                </p>
                <p>Your application will be sent to the coach for approval.</p>
              </div>

              <div className="modal-actions">
                <button className="confirm-button" onClick={handleApplyConfirm}>
                  Yes, Apply
                </button>
                <button className="cancel-button" onClick={() => setShowApplyModal(false)}>
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  // DYNAMIC RENDERING: If player has a team, show player dashboard with team info
  return (
    <main className="main-content">
      <div className="player-dashboard">
        <div className="player-welcome">
          <div className="player-avatar">
            <span>{playerData.fname ? playerData.fname.charAt(0) : "P"}</span>
          </div>
          <div className="player-welcome-text">
            <h1>Welcome, {playerData.fname} {playerData.lname}</h1>
            <p>
              #{playerData.jerseyNum} | {playerData.position}
            </p>
          </div>
          <button 
            className="refresh-button" 
            onClick={handleManualRefresh}
          >
            Refresh
          </button>
        </div>

        <div className="player-team-card">
          <div className="team-banner college"></div>
          <div className="team-content">
            <h2>{playerData.team?.teamName || "Your Team"}</h2>
            <p>{playerData.team?.description || "No team description available."}</p>
            <div className="team-meta">
              <div className="meta-item">
                <span className="meta-label">Coach:</span>
                <span className="meta-value">
                  {playerData.team?.coaches && playerData.team.coaches.length > 0 
                    ? playerData.team.coaches.map(coach => `${coach.fname} ${coach.lname}`).join(', ')
                    : "No coach assigned"}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Team ID:</span>
                <span className="meta-value">{playerData.team?.teamId || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="team-members-section">
          <h2>Team Members</h2>
          <div className="team-members-grid">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div className="team-member-card" key={member.id}>
                  <div className="member-avatar">
                    <span>{member.avatar}</span>
                  </div>
                  <div className="member-details">
                    <h3>
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="member-jersey">#{member.jerseyNumber}</p>
                    <p className="member-position">{member.position}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-members">No team members found.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PHome;

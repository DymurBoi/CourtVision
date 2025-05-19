"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../components/AuthContext"
import { api } from "../../utils/axiosConfig"
import "../../styles/coach/C-Team.css"
import "../../styles/coach/C-Home.css"

function CHome() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [coachData, setCoachData] = useState({
    fname: "",
    lname: "",
    email: "",
    teams: []
  })
  
  const [teams, setTeams] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState(null)
  const [players, setPlayers] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")

  // Fetch coach data when component mounts
  useEffect(() => {
    const fetchCoachData = async () => {
      if (!user || !user.id) {
        console.log("No user data available for fetching coach info");
        return
      }

      console.log("Raw user data from AuthContext:", user);
      
      try {
        // Extract the numeric ID from the format "COACH_123"
        let coachId = user.id;
        let originalId = coachId; // Save for debugging
        
        if (typeof coachId === 'string' && coachId.startsWith("COACH_")) {
          coachId = coachId.substring(6); // Remove "COACH_" prefix
          console.log("Extracted numeric coach ID:", coachId, "from original:", originalId);
        } else {
          console.log("Using ID as-is (no prefix detected):", coachId);
        }
        
        // Make sure ID is a number if the backend expects it
        if (coachId && !isNaN(Number(coachId))) {
          coachId = Number(coachId);
        }
          
        console.log("Attempting to fetch coach data with ID:", coachId, "Type:", typeof coachId);
        
        // Make direct request to the endpoint without auth token
        const apiEndpoint = `http://localhost:8080/api/coaches/get/${coachId}`;
        console.log("Making direct API request to:", apiEndpoint);
        
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Coach data received (raw):", data);
        
        if (!data) {
          console.error("Received empty data from API");
          setLoading(false);
          return;
        }
        
        // Check if essential fields exist
        if (!data.fname || !data.lname) {
          console.warn("Missing name data in API response:", data);
        }
        
        setCoachData(data)
        
        // Get coach's teams using the correct endpoint from TeamController
        console.log("Fetching teams for coach ID:", coachId);
        
        const teamsEndpoint = `http://localhost:8080/api/teams/get/by-coach/${coachId}`;
        const teamsResponse = await fetch(teamsEndpoint);
        if (!teamsResponse.ok) {
          throw new Error(`Teams API returned status ${teamsResponse.status}`);
        }
        
        const teamsData = await teamsResponse.json();
        
        console.log("Coach teams received (raw):", teamsData);
        
        if (teamsData && teamsData.length > 0) {
          console.log("Coach has teams, setting up team data");
          setTeams(teamsData.map(team => ({
            id: team.teamId,
            teamId: team.teamId,
            name: team.teamName,
            description: `Team coached by ${data.fname} ${data.lname}`,
            players: team.players || []
          })))
          
          setSelectedTeamId(teamsData[0].teamId)
        } else {
          console.log("Coach has no teams");
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching coach data:", error)
        if (error.response) {
          console.error("Response error status:", error.response.status);
          console.error("Response error data:", error.response.data);
        } else if (error.request) {
          console.error("Network error - no response received");
        } else {
          console.error("Error setting up request:", error.message);
        }
        
        // Fallback to sample data if API fails
        console.log("Using fallback sample data for coach");
        setTeams([
          {
            id: 1,
            teamId: 1,
            name: "CIT-U College Team",
            description: "Our collegiate basketball team competing in university leagues and championships.",
            players: [
              { id: 101, fname: "James", lname: "Wilson", jerseyNum: 23, position: "Point Guard" },
              { id: 102, fname: "Robert", lname: "Garcia", jerseyNum: 10, position: "Shooting Guard" },
              { id: 103, fname: "Michael", lname: "Chen", jerseyNum: 7, position: "Small Forward" },
              { id: 104, fname: "David", lname: "Smith", jerseyNum: 32, position: "Power Forward" },
              { id: 105, fname: "Christopher", lname: "Johnson", jerseyNum: 45, position: "Center" },
            ],
          },
          {
            id: 2,
            teamId: 2,
            name: "CIT-U High School Team",
            description: "Our high school basketball team developing young talents.",
            players: [
              { id: 201, fname: "Alex", lname: "Williams", jerseyNum: 4, position: "Point Guard" },
              { id: 202, fname: "Jake", lname: "Miller", jerseyNum: 11, position: "Shooting Guard" },
            ],
          },
        ])
        setSelectedTeamId(1)
        setLoading(false)
      }
    }

    fetchCoachData()
  }, [user])

  // Get the selected team's players
  useEffect(() => {
    if (selectedTeamId) {
      const fetchTeamPlayers = async () => {
        try {
          // Get players for the selected team using the correct endpoint from PlayerController
          console.log("Fetching players for team ID:", selectedTeamId);
          const response = await api.get(`/players/get/by-team/${selectedTeamId}`);
          console.log("Team players API response status:", response.status);
          const playersData = response.data;
          console.log("Team players received:", playersData);
          
          setPlayers(playersData || []);
        } catch (error) {
          console.error("Error fetching team players:", error);
          // Fallback - find players in the local teams state
          const team = teams.find((t) => t.id === selectedTeamId || t.teamId === selectedTeamId);
          if (team && team.players) {
            setPlayers(team.players);
          } else {
            setPlayers([]);
          }
        }
      };
      
      fetchTeamPlayers();
    }
  }, [selectedTeamId, teams]);

  const handleTeamChange = (e) => {
    setSelectedTeamId(Number(e.target.value))
  }

  const handleRemovePlayer = async (playerId) => {
    if (!window.confirm("Are you sure you want to remove this player?")) {
      return
    }
    
    if (selectedTeamId) {
      try {
        // Call API to remove player from team
        await api.delete(`/teams/${selectedTeamId}/players/${playerId}`)
        
        // Update local state
        setPlayers(players.filter((player) => player.id !== playerId))
        
        // Update teams state to reflect the change
        setTeams(
          teams.map((team) => {
            if (team.id === selectedTeamId || team.teamId === selectedTeamId) {
              return {
                ...team,
                players: (team.players || []).filter((player) => player.id !== playerId),
              }
            }
            return team
          }),
        )
      } catch (error) {
        console.error("Error removing player:", error)
        alert("Failed to remove player. Please try again.")
      }
    }
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName.trim() || !user?.id) return

    try {
      // Call API to create new team
      const response = await api.post('/teams', {
        name: newTeamName,
        description: `Team created on ${new Date().toLocaleDateString()}`,
        coachId: user.id
      })
      
      const newTeam = response.data
      
      // Add the new team to the teams array
      setTeams([...teams, newTeam])

      // Select the new team
      setSelectedTeamId(newTeam.id || newTeam.teamId)
      
      // Reset and close the modal
      setNewTeamName("")
      setShowCreateModal(false)
    } catch (error) {
      console.error("Error creating team:", error)
      alert("Failed to create team. Please try again.")
      
      // Fallback to local creation if API fails
      const newTeamId = Math.max(...teams.map((t) => t.id || t.teamId), 0) + 1
      const newTeam = {
        id: newTeamId,
        name: newTeamName,
        description: `Team created on ${new Date().toLocaleDateString()}`,
        players: [],
      }
      setTeams([...teams, newTeam])
      setSelectedTeamId(newTeamId)
      setNewTeamName("")
      setShowCreateModal(false)
    }
  }

  // Find the selected team
  const selectedTeam = teams.find((team) => team.id === selectedTeamId || team.teamId === selectedTeamId) || teams[0]
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <main className="main-content">
      <div className="coach-welcome">
        <div className="coach-avatar">
          <span>{coachData.fname ? coachData.fname.charAt(0) : "C"}</span>
        </div>
        <div className="coach-welcome-text">
          <h1>Welcome, Coach {coachData.fname} {coachData.lname}</h1>
        </div>
      </div>
      
      <div className="team-actions">
        <button className="create-team-button" onClick={() => setShowCreateModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="action-icon"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="23" y1="11" x2="17" y2="11"></line>
            <line x1="20" y1="8" x2="20" y2="14"></line>
          </svg>
          Create New Team
        </button>
      </div>

      <div className="team-selector">
        <label htmlFor="team-select">Select Team:</label>
        <select id="team-select" value={selectedTeamId || ""} onChange={handleTeamChange} className="team-select">
          {teams.map((team) => (
            <option key={team.id || team.teamId} value={team.id || team.teamId}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div className="team-details-header">
          <div className="team-header-flex">
            <h1>{selectedTeam.name}</h1>
          </div>
          <p>{selectedTeam.description}</p>
          <div className="team-meta">
            <div className="meta-item">
              <span className="meta-label">Players:</span>
              <span className="meta-value">{players.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className="players-container">
        <div className="players-header">
          <div className="player-number-header">Jersey</div>
          <div className="player-name-header">Name</div>
          <div className="player-position-header">Position</div>
          <div className="player-action-header">Action</div>
        </div>

        {players.length > 0 ? (
          players.map((player) => (
            <div className="player-item" key={player.id}>
              <div className="player-number">#{player.jerseyNum}</div>
              <div className="player-name">
                {player.fname} {player.lname}
              </div>
              <div className="player-position">{player.position}</div>
              <div className="player-action">
                <button className="remove-player-button" onClick={() => handleRemovePlayer(player.id)}>
                  Remove Player
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-players">No players found for this team.</div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Team</h2>
              <button className="close-button" onClick={() => setShowCreateModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTeam}>
              <div className="modal-content">
                <div className="form-group">
                  <label htmlFor="team-name">Team Name</label>
                  <input
                    type="text"
                    id="team-name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="confirm-button">
                  Create Team
                </button>
                <button type="button" className="cancel-button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default CHome

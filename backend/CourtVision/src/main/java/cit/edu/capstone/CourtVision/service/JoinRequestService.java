package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.JoinRequest;
import cit.edu.capstone.CourtVision.entity.JoinRequestCoach;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.JoinRequestCoachRepository;
import cit.edu.capstone.CourtVision.repository.JoinRequestRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

@Service
public class JoinRequestService {
    private static final Logger logger = LoggerFactory.getLogger(JoinRequestService.class);
    
    @Autowired
    private JoinRequestRepository joinRequestRepository;
    
    @Autowired
    private JoinRequestCoachRepository joinRequestCoachRepository;
    
    @Autowired
    private PlayerRepository playerRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private PlayerService playerService;
    
    @Autowired
    private TeamService teamService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public JoinRequest createRequest(JoinRequest joinRequest) {
        // First save the join request
        JoinRequest savedRequest = joinRequestRepository.save(joinRequest);
        
        // Get all coaches for the team and create JoinRequestCoach entries for each
        Team team = joinRequest.getTeam();
        if (team != null && team.getCoaches() != null && !team.getCoaches().isEmpty()) {
            List<JoinRequestCoach> requestCoaches = new ArrayList<>();
            
            for (Coach coach : team.getCoaches()) {
                JoinRequestCoach requestCoach = new JoinRequestCoach();
                requestCoach.setJoinRequest(savedRequest);
                requestCoach.setCoach(coach);
                requestCoach.setViewed(0);
                requestCoaches.add(requestCoach);
            }
            
            joinRequestCoachRepository.saveAll(requestCoaches);
            savedRequest.setRequestCoaches(requestCoaches);
        }
        
        return savedRequest;
    }

    public List<JoinRequest> getAllRequests() {
        return joinRequestRepository.findAll();
    }

    public JoinRequest getRequestById(Long requestId) {
        return joinRequestRepository.findById(requestId).orElse(null);
    }

    public List<JoinRequest> getRequestsByCoachId(Long coachId) {
        // We need to change this to use the join request coach table
        List<JoinRequestCoach> requestCoaches = joinRequestCoachRepository.findByCoach_CoachId(coachId.intValue());
        List<JoinRequest> joinRequests = new ArrayList<>();
        
        for (JoinRequestCoach requestCoach : requestCoaches) {
            joinRequests.add(requestCoach.getJoinRequest());
        }
        
        return joinRequests;
    }
    
    public List<JoinRequest> getRequestsByPlayerId(Long playerId) {
        return joinRequestRepository.findByPlayer_PlayerId(playerId);
    }
    
    public List<JoinRequest> getRequestsByTeamId(Long teamId) {
        logger.info("Service: Fetching join requests for team with ID: {}", teamId);
        return joinRequestRepository.findByTeam_TeamId(teamId);
    }

    /**
     * Updates a join request and handles player-team assignment if approved
     * @param requestId The ID of the request to update
     * @param newRequest The updated request (containing new status)
     * @return The updated JoinRequest
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public JoinRequest updateRequest(Long requestId, JoinRequest newRequest) {
        logger.info("Updating request {} with status {}", requestId, newRequest.getRequestStatus());
        JoinRequest existing = getRequestById(requestId);
        
        if (existing != null) {
            // Store the old status to check if we're changing from pending to approved
            int oldStatus = existing.getRequestStatus();
            int newStatus = newRequest.getRequestStatus();
            
            logger.info("Request {}: Old status = {}, New status = {}", requestId, oldStatus, newStatus);
            
            // Update the status
            existing.setRequestStatus(newStatus);
            JoinRequest updated = joinRequestRepository.saveAndFlush(existing);
            
            // If status is changing to approved (status code 1), update the player's team
            if (oldStatus != 1 && newStatus == 1) {
                Player player = existing.getPlayer();
                Team team = existing.getTeam();
                
                if (player != null && team != null) {
                    Long playerId = player.getPlayerId();
                    Long teamId = team.getTeamId();
                    
                    logger.info("Approving request: Assigning Player {} to Team {}", playerId, teamId);
                    
                    try {
                        // SIMPLE APPROACH: Use direct SQL and avoid any potential ORM issues
                        String updateSql = "UPDATE player SET team_id = ? WHERE player_id = ?";
                        logger.info("Executing SQL: {} with params [teamId={}, playerId={}]", 
                                    updateSql, teamId, playerId);
                        
                        int rowsAffected = jdbcTemplate.update(updateSql, teamId, playerId);
                        logger.info("SQL UPDATE RESULT: {} rows affected", rowsAffected);
                        
                        if (rowsAffected != 1) {
                            logger.error("Expected to update 1 row but updated {} rows", rowsAffected);
                            throw new RuntimeException("Failed to update player team_id: unexpected row count");
                        }
                        
                        // Verify with a separate query that bypasses any caching
                        String verifySql = "SELECT team_id FROM player WHERE player_id = ?";
                        logger.info("Verifying update with SQL: {}", verifySql);
                        
                        try {
                            Long verifiedTeamId = jdbcTemplate.queryForObject(
                                verifySql, Long.class, playerId);
                            
                            logger.info("VERIFICATION RESULT: Player {} now has team_id = {}", 
                                      playerId, verifiedTeamId);
                            
                            if (!teamId.equals(verifiedTeamId)) {
                                logger.error("Verification failed: Expected team_id={} but found team_id={}", 
                                           teamId, verifiedTeamId);
                                throw new RuntimeException("Team assignment verification failed");
                            }
                            
                            logger.info("TEAM ASSIGNMENT SUCCESSFUL AND VERIFIED");
                        } catch (DataAccessException e) {
                            logger.error("Error during verification query: {}", e.getMessage());
                            throw new RuntimeException("Failed to verify team assignment", e);
                        }
                    } catch (Exception e) {
                        logger.error("Error updating player-team relationship: ", e);
                        throw new RuntimeException("Failed to assign player to team: " + e.getMessage(), e);
                    }
                } else {
                    logger.warn("Cannot assign player to team: Player = {}, Team = {}", player, team);
                    throw new IllegalArgumentException("Cannot assign player to team: Missing player or team data");
                }
            }
            
            return updated;
        }
        
        logger.warn("Request {} not found", requestId);
        return null;
    }

    @Transactional
    public void deleteRequest(Long requestId) {
        // Delete associated JoinRequestCoach entries first
        joinRequestCoachRepository.deleteByJoinRequest_RequestId(requestId);
        
        // Then delete the JoinRequest
        joinRequestRepository.deleteById(requestId);
    }

    public Player assignPlayerToTeam(Long teamId, Long playerId) {
        // Fetch the team and player by their IDs
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new RuntimeException("Player not found"));

        // Add the player to the team's player list
        team.getPlayers().add(player);

        // Save the updated team
        teamRepository.save(team);

        return player;  // Return the player (you can return whatever is needed, maybe the updated team)
    }
} 
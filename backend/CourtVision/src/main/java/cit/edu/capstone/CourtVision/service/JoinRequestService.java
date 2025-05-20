package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.JoinRequest;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.JoinRequestRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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
    private PlayerRepository playerRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private PlayerService playerService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public JoinRequest createRequest(JoinRequest joinRequest) {
        return joinRequestRepository.save(joinRequest);
    }

    public List<JoinRequest> getAllRequests() {
        return joinRequestRepository.findAll();
    }

    public JoinRequest getRequestById(Long requestId) {
        return joinRequestRepository.findById(requestId).orElse(null);
    }

    public List<JoinRequest> getRequestsByCoachId(Long coachId) {
        return joinRequestRepository.findByCoach_CoachId(coachId);
    }
    
    public List<JoinRequest> getRequestsByPlayerId(Long playerId) {
        return joinRequestRepository.findByPlayer_PlayerId(playerId);
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

    public void deleteRequest(Long requestId) {
        joinRequestRepository.deleteById(requestId);
    }
} 
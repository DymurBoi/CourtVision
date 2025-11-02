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
        int oldStatus = existing.getRequestStatus();
        int newStatus = newRequest.getRequestStatus();
        
        logger.info("Request {}: Old status = {}, New status = {}", requestId, oldStatus, newStatus);
        
        existing.setRequestStatus(newStatus);
        JoinRequest updated = joinRequestRepository.saveAndFlush(existing);
        
        // APPROVED LOGIC 
        if (oldStatus != 1 && newStatus == 1) {
            Player player = existing.getPlayer();
            Team team = existing.getTeam();
            
            if (player != null && team != null) {
                Long playerId = player.getPlayerId();
                Long teamId = team.getTeamId();
                
                logger.info("Approving request: Assigning Player {} to Team {}", playerId, teamId);
                
                try {
                    // Update player's team
                    player.setTeam(team);
                    playerRepository.save(player);
                    
                    // Verify the update
                    Player verifiedPlayer = playerRepository.findById(playerId)
                        .orElseThrow(() -> new RuntimeException("Player not found after update"));
                        
                    if (verifiedPlayer.getTeam() == null || !verifiedPlayer.getTeam().getTeamId().equals(teamId)) {
                        throw new RuntimeException("Team assignment verification failed");
                    }
                    
                    logger.info("TEAM ASSIGNMENT SUCCESSFUL AND VERIFIED");

                    // Reject all other pending requests for this player
                    List<JoinRequest> otherRequests = joinRequestRepository.findByPlayer_PlayerId(playerId);
                    for (JoinRequest request : otherRequests) {
                        if (!request.getRequestId().equals(requestId) && request.getRequestStatus() == 0) {
                            request.setRequestStatus(2); // Set to rejected
                            joinRequestRepository.save(request);
                        }
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

        // REJECTED LOGIC 
        else if (newStatus == 2) {
            logger.info("Join request {} rejected by coach.", requestId);

            try {
                // Mark all related JoinRequestCoach entries as viewed/rejected
                List<JoinRequestCoach> requestCoaches = existing.getRequestCoaches();
                if (requestCoaches != null && !requestCoaches.isEmpty()) {
                    for (JoinRequestCoach reqCoach : requestCoaches) {
                        reqCoach.setViewed(1);
                        joinRequestCoachRepository.save(reqCoach);
                    }
                }

                // Persist the rejection
                existing.setRequestStatus(2);
                joinRequestRepository.saveAndFlush(existing);

                logger.info("Join request {} successfully marked as rejected.", requestId);
            } catch (Exception e) {
                logger.error("Error while rejecting join request {}: {}", requestId, e.getMessage(), e);
                throw new RuntimeException("Failed to reject join request: " + e.getMessage(), e);
            }
        }
        
        return updated;
    }
    
    logger.warn("Request {} not found", requestId);
    return null;
}


    @Transactional
    public void deleteRequest(Long requestId) {
        joinRequestCoachRepository.deleteByJoinRequest_RequestId(requestId);
        joinRequestRepository.deleteById(requestId);
    }

    @Transactional
    public void deleteAllPlayerRequests(Long playerId) {
        List<JoinRequest> requests = joinRequestRepository.findByPlayer_PlayerId(playerId);
        for (JoinRequest request : requests) {
            deleteRequest(request.getRequestId());
        }
    }
} 
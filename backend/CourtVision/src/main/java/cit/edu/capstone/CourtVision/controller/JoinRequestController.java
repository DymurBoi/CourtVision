package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.JoinRequestDTO;
import cit.edu.capstone.CourtVision.mapper.JoinRequestMapper;
import cit.edu.capstone.CourtVision.entity.JoinRequest;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import cit.edu.capstone.CourtVision.repository.CoachRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import cit.edu.capstone.CourtVision.service.JoinRequestService;
import cit.edu.capstone.CourtVision.service.TeamService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/join-requests")
public class JoinRequestController {
    private static final Logger logger = LoggerFactory.getLogger(JoinRequestController.class);
    
    @Autowired
    private JoinRequestService joinRequestService;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private CoachRepository coachRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private TeamService teamService;

    @PreAuthorize("hasAuthority('ROLE_PLAYER')")
    @PostMapping("/post")
    public ResponseEntity<JoinRequestDTO> createRequest(@RequestBody JoinRequestDTO dto) {
        try {
            logger.info("Creating join request from player {} for team {}", dto.getPlayerId(), dto.getTeamId());
            
            Optional<Player> player = playerRepository.findById(dto.getPlayerId());
            if (player.isEmpty()) {
                logger.error("Player not found with ID: {}", dto.getPlayerId());
                return ResponseEntity.badRequest().build();
            }
            
            Optional<Team> team = teamRepository.findById(dto.getTeamId());
            if (team.isEmpty()) {
                logger.error("Team not found with ID: {}", dto.getTeamId());
                return ResponseEntity.badRequest().build();
            }
            
            // We still need a primary coach for the legacy field
            if (team.get().getCoaches() == null || team.get().getCoaches().isEmpty()) {
                logger.error("Team {} has no coaches", dto.getTeamId());
                return ResponseEntity.badRequest().build();
            }
            
            // We'll use the first coach as the primary coach for backward compatibility
            Coach primaryCoach = team.get().getCoaches().get(0);
            
            JoinRequest entity = JoinRequestMapper.toEntity(dto);
            entity.setPlayer(player.get());
            entity.setCoach(primaryCoach);  // Keep this for backward compatibility
            entity.setTeam(team.get());
            
            logger.info("Saving join request with player {}, coach {} and team {}", 
                        player.get().getPlayerId(), primaryCoach.getCoachId(), team.get().getTeamId());
            
            JoinRequest saved = joinRequestService.createRequest(entity);
            logger.info("Join request created successfully with ID: {}", saved.getRequestId());
            
            return ResponseEntity.ok(JoinRequestMapper.toDto(saved));
        } catch (Exception e) {
            logger.error("Error creating join request: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/get/all")
    public List<JoinRequestDTO> getAllRequests() {
        return joinRequestService.getAllRequests().stream()
                .map(JoinRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @GetMapping("/by-coach/{coachId}")
    public List<JoinRequestDTO> getRequestsByCoach(@PathVariable Long coachId) {
        return joinRequestService.getRequestsByCoachId(coachId).stream()
                .map(JoinRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ROLE_PLAYER')")
    @GetMapping("/by-player/{playerId}")
    public List<JoinRequestDTO> getRequestsByPlayer(@PathVariable Long playerId) {
        return joinRequestService.getRequestsByPlayerId(playerId).stream()
                .map(JoinRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JoinRequestDTO> getRequestById(@PathVariable Long id) {
        JoinRequest req = joinRequestService.getRequestById(id);
        if (req == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(JoinRequestMapper.toDto(req));
    }

    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<JoinRequestDTO> updateRequest(@PathVariable Long id, @RequestBody JoinRequestDTO dto) {
        logger.info("Updating join request {} with status {}", id, dto.getRequestStatus());
        
        JoinRequest existing = joinRequestService.getRequestById(id);
        if (existing == null) {
            logger.warn("Join request not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        
        // Only update status - keep existing player/coach/team references
        existing.setRequestStatus(dto.getRequestStatus());
        
        // The JoinRequestService.updateRequest method will handle player-team assignment
        JoinRequest updated = joinRequestService.updateRequest(id, existing);
        return ResponseEntity.ok(JoinRequestMapper.toDto(updated));
    }

    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        logger.info("Deleting join request with ID: {}", id);
        
        JoinRequest existing = joinRequestService.getRequestById(id);
        if (existing == null) {
            logger.warn("Join request not found with ID: {}", id);
            return ResponseEntity.notFound().build();
        }
        
        joinRequestService.deleteRequest(id);
        logger.info("Join request {} deleted successfully", id);
        
        return ResponseEntity.ok().build();
    }
    
    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @GetMapping("/by-team/{teamId}")
    public List<JoinRequestDTO> getRequestsByTeam(@PathVariable Long teamId) {
        logger.info("Fetching join requests for team with ID: {}", teamId);
        
        return joinRequestService.getRequestsByTeamId(teamId).stream()
                .map(JoinRequestMapper::toDto)
                .collect(Collectors.toList());
    }
    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @PutMapping("/accept/{id}")
    public ResponseEntity<JoinRequestDTO> acceptJoinRequest(@PathVariable Long id) {
        try {
            // Fetch the join request by ID
            JoinRequest joinRequest = joinRequestService.getRequestById(id);
            if (joinRequest == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if the request status is already accepted
            if (joinRequest.getRequestStatus() == 1) {
                return ResponseEntity.status(400).body(null); // Bad Request if already accepted
            }

            // Update the status of the join request to "accepted" (1)
            joinRequest.setRequestStatus(1);

            // Get the player and the team from the join request
            Player player = joinRequest.getPlayer();
            Team team = joinRequest.getTeam();

            // Now use the existing method to add the player to the team
            teamService.assignPlayerToTeam(team.getTeamId(), player.getPlayerId());

            // Save the updated join request
            joinRequestService.updateRequest(id, joinRequest); // Update the request status in DB

            // Return a response with the updated request DTO
            return ResponseEntity.ok(JoinRequestMapper.toDto(joinRequest));
        } catch (Exception e) {
            logger.error("Error accepting join request: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
} 
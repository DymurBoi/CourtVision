package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.PhysicalUpdateRequestDTO;
import cit.edu.capstone.CourtVision.dto.PhysicalUpdateRequestMapper;
import cit.edu.capstone.CourtVision.entity.PhysicalUpdateRequest;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.service.CoachService;
import cit.edu.capstone.CourtVision.service.PhysicalUpdateRequestService;
import cit.edu.capstone.CourtVision.service.PlayerService;
import cit.edu.capstone.CourtVision.service.TeamService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/physical-update-requests")
@CrossOrigin(origins = {"http://localhost:3000", "https://court-vision-frontend.vercel.app"})
public class PhysicalUpdateRequestController {
    private static final Logger logger = LoggerFactory.getLogger(PhysicalUpdateRequestController.class);
    
    @Autowired
    private PhysicalUpdateRequestService physicalUpdateRequestService;
    
    @Autowired
    private PlayerService playerService;
    
    @Autowired
    private CoachService coachService;
    
    @Autowired
    private TeamService teamService;

    /**
     * Create a new physical update request
     * @param dto The request details
     * @return The created request
     */
    @PostMapping
    public ResponseEntity<PhysicalUpdateRequestDTO> createRequest(@RequestBody PhysicalUpdateRequestDTO dto) {
        logger.info("Received physical update request: {}", dto);
        
        try {
            // Validate DTO
            if (dto.getPlayerId() == null) {
                logger.error("Player ID is null in the request");
                return ResponseEntity.badRequest().build();
            }
            
            // Converting from using a single coach to using multiple coaches based on the team
            // We still need a primary coach for backward compatibility
            
            // Convert DTO to entity
            PhysicalUpdateRequest entity = PhysicalUpdateRequestMapper.toEntity(dto);
            logger.info("Converted to entity successfully");
            
            // Set related entities
            logger.info("Fetching player with ID: {}", dto.getPlayerId());
            Player player = playerService.getPlayerById(dto.getPlayerId());
            if (player == null) {
                logger.error("Player not found with ID: {}", dto.getPlayerId());
                return ResponseEntity.badRequest().body(null);
            }
            
            logger.info("Getting team from player: {}", player.getPlayerId());
            Team team = player.getTeam(); // Use player's team
            if (team == null) {
                logger.error("Player {} does not have a team", dto.getPlayerId());
                return ResponseEntity.badRequest().body(null);
            }
            
            // Check if team has coaches
            if (team.getCoaches() == null || team.getCoaches().isEmpty()) {
                logger.error("Team {} has no coaches", team.getTeamId());
                return ResponseEntity.badRequest().body(null);
            }
            
            // Use the first coach as the primary coach for backward compatibility
            Coach primaryCoach = team.getCoaches().get(0);
            
            entity.setPlayer(player);
            entity.setCoach(primaryCoach); // Keep this for backward compatibility
            entity.setTeam(team);
            
            // Save the request
            logger.info("Saving physical update request");
            PhysicalUpdateRequest saved = physicalUpdateRequestService.createRequest(entity);
            logger.info("Physical update request saved successfully with ID: {}", saved.getRequestId());
            
            return ResponseEntity.ok(PhysicalUpdateRequestMapper.toDto(saved));
        } catch (Exception e) {
            logger.error("Error creating physical update request: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all physical update requests
     * @return List of all requests
     */
    @GetMapping
    public List<PhysicalUpdateRequestDTO> getAllRequests() {
        return physicalUpdateRequestService.getAllRequests().stream()
                .map(PhysicalUpdateRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get requests for a specific coach
     * @param coachId The coach ID
     * @return List of requests for this coach
     */
    @GetMapping("/coach/{coachId}")
    public List<PhysicalUpdateRequestDTO> getRequestsByCoach(@PathVariable Long coachId) {
        return physicalUpdateRequestService.getRequestsByCoachId(coachId).stream()
                .map(PhysicalUpdateRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get requests for a specific player
     * @param playerId The player ID
     * @return List of requests by this player
     */
    @GetMapping("/player/{playerId}")
    public List<PhysicalUpdateRequestDTO> getRequestsByPlayer(@PathVariable Long playerId) {
        return physicalUpdateRequestService.getRequestsByPlayerId(playerId).stream()
                .map(PhysicalUpdateRequestMapper::toDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get requests for a specific team
     * @param teamId The team ID
     * @return List of requests for this team
     */
    @GetMapping("/team/{teamId}")
    public List<PhysicalUpdateRequestDTO> getRequestsByTeam(@PathVariable Long teamId) {
        logger.info("Fetching physical update requests for team with ID: {}", teamId);
        
        return physicalUpdateRequestService.getRequestsByTeamId(teamId).stream()
                .map(PhysicalUpdateRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a request by ID
     * @param id The request ID
     * @return The request details
     */
    @GetMapping("/{id}")
    public ResponseEntity<PhysicalUpdateRequestDTO> getRequestById(@PathVariable Long id) {
        PhysicalUpdateRequest req = physicalUpdateRequestService.getRequestById(id);
        if (req == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(PhysicalUpdateRequestMapper.toDto(req));
    }

    /**
     * Update a request (typically to approve or reject)
     * @param id The request ID
     * @param dto The updated request data
     * @return The updated request
     */
    @PutMapping("/{id}")
    public ResponseEntity<PhysicalUpdateRequestDTO> updateRequest(@PathVariable Long id, @RequestBody PhysicalUpdateRequestDTO dto) {
        PhysicalUpdateRequest existing = physicalUpdateRequestService.getRequestById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        
        // Update only the status from the DTO
        existing.setRequestStatus(dto.getRequestStatus());
        
        // The PhysicalUpdateRequestService.updateRequest method will handle physical records update
        PhysicalUpdateRequest updated = physicalUpdateRequestService.updateRequest(id, existing);
        return ResponseEntity.ok(PhysicalUpdateRequestMapper.toDto(updated));
    }

    /**
     * Delete a request
     * @param id The request ID to delete
     * @return Success response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        PhysicalUpdateRequest existing = physicalUpdateRequestService.getRequestById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        
        physicalUpdateRequestService.deleteRequest(id);
        return ResponseEntity.ok().build();
    }
} 
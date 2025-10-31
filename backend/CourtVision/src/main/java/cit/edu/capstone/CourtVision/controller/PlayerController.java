package cit.edu.capstone.CourtVision.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cit.edu.capstone.CourtVision.dto.PlayerDTO;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.mapper.PlayerMapper;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import cit.edu.capstone.CourtVision.service.PlayerService;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private static final Logger logger = LoggerFactory.getLogger(PlayerController.class);

    @Autowired
    private PlayerService playerService;

    @Autowired
    private TeamRepository teamRepository;

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/all")
    public ResponseEntity<List<PlayerDTO>> getAllPlayers() {
        List<Player> players = playerService.getAllPlayers();
        List<PlayerDTO> dtos = players.stream()
                .map(PlayerMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) {
        // Get current authentication from security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();

        // For debugging - log current user info
        logger.info("Current authenticated user: {}", userEmail);
        logger.info("Requested player ID: {}", id);

        // If this is a player trying to access their own record, extract ID from subject
        if (auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PLAYER"))) {

            // Let players access their own data
            String playerId = null;

            // Get principal information if available (this would be the JWT subject)
            Object principal = auth.getPrincipal();
            if (principal instanceof String && ((String) principal).startsWith("PLAYER_")) {
                // Extract numeric ID from "PLAYER_X" format
                playerId = ((String) principal).substring(7);
                logger.info("Extracted player ID from subject: {}", playerId);

                // Compare with requested ID
                if (playerId != null && !id.toString().equals(playerId)) {
                    logger.warn("Player attempted to access another player's data. Subject: {}, Requested: {}",
                            playerId, id);
                    return ResponseEntity.status(403).build();
                }
            }
        }

        Player player = playerService.getPlayerById(id);
        if (player == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(PlayerMapper.toDto(player));
    }


    @PostMapping("/post")
    public Player createPlayer(@jakarta.validation.Valid @RequestBody Player player) {
        return playerService.createPlayer(player);
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PLAYER')")
    @PutMapping("/put/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable Long id, @RequestBody Player updatedPlayer) {
        Player savedPlayer = playerService.updatePlayer(id, updatedPlayer);
        if (savedPlayer == null) return ResponseEntity.notFound().build();
        PlayerDTO dto = PlayerMapper.toDto(savedPlayer);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/delete/{id}")
    public void deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
    }

    @GetMapping("/get/by-team/{teamId}")
    public List<Player> getPlayersByTeamId(@PathVariable Long teamId) {
        return playerService.getPlayersByTeamId(teamId);
    }

    /**
     * Direct endpoint for assigning a player to a team
     * This provides a backup mechanism if the regular join request process fails
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/{playerId}/team/{teamId}")
    public ResponseEntity<PlayerDTO> assignPlayerToTeam(
            @PathVariable Long playerId,
            @PathVariable Long teamId) {

        logger.info("Direct team assignment requested: Player {} to Team {}", playerId, teamId);

        // Find the team
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            logger.error("Team {} not found for direct assignment", teamId);
            return ResponseEntity.badRequest().build();
        }

        // Assign the player to the team
        try {
            Player updatedPlayer = playerService.assignPlayerToTeam(playerId, team);
            if (updatedPlayer == null) {
                logger.error("Failed to assign player {} to team {}", playerId, teamId);
                return ResponseEntity.badRequest().build();
            }

            logger.info("Successfully assigned player {} to team {} via direct endpoint",
                    playerId, teamId);

            return ResponseEntity.ok(PlayerMapper.toDto(updatedPlayer));
        } catch (Exception e) {
            logger.error("Error during direct team assignment: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}


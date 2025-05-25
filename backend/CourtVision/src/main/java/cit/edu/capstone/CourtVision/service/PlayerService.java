package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(PlayerService.class);

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PhysicalRecordService physicalRecordService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Long id) {
        return playerRepository.findById(id).orElse(null);
    }


    public Player createPlayer(Player player) {
        player.setPassword(passwordEncoder.encode(player.getPassword()));
        Player savedPlayer = playerRepository.save(player);

        // Automatically create PhysicalRecords with initial zero values
        PhysicalRecords initialRecord = PhysicalRecords.builder()
                .weight(BigDecimal.ZERO)
                .height(BigDecimal.ZERO)
                .wingspan(BigDecimal.ZERO)
                .vertical(BigDecimal.ZERO)
                .bmi(BigDecimal.ZERO)
                .dateRecorded(LocalDate.now())
                .player(savedPlayer)
                .build();

        physicalRecordService.save(initialRecord);

        return savedPlayer;
    }


    public Player updatePlayer(Long id, Player updatedPlayer) {
        Player existingPlayer = getPlayerById(id);
        if (existingPlayer != null) {
            if (updatedPlayer.getFname() != null) {
                existingPlayer.setFname(updatedPlayer.getFname());
            }
            if (updatedPlayer.getLname() != null) {
                existingPlayer.setLname(updatedPlayer.getLname());
            }
            if (updatedPlayer.getEmail() != null) {
                existingPlayer.setEmail(updatedPlayer.getEmail());
            }
            // Only encode if password is being updated
            if (updatedPlayer.getPassword() != null && !updatedPlayer.getPassword().isEmpty()) {
                existingPlayer.setPassword(passwordEncoder.encode(updatedPlayer.getPassword()));
            }
            if (updatedPlayer.getBirthDate() != null) {
                existingPlayer.setBirthDate(updatedPlayer.getBirthDate());
            }
            if (updatedPlayer.getJerseyNum() != 0) {
                existingPlayer.setJerseyNum(updatedPlayer.getJerseyNum());
            }
            if (updatedPlayer.getPosition() != null) {
                existingPlayer.setPosition(updatedPlayer.getPosition());
            }
            if (updatedPlayer.getTeam() != null) {
                existingPlayer.setTeam(updatedPlayer.getTeam());
            }


            return playerRepository.save(existingPlayer);
        }
        return null;
    }

    /**
     * Assign a player to a team
     * @param playerId The player to assign
     * @param team The team to assign the player to
     * @return The updated player
     */
    @Transactional
    public Player assignPlayerToTeam(Long playerId, Team team) {
        logger.info("Assigning player {} to team {}", playerId, team != null ? team.getTeamId() : "null");

        Player player = playerRepository.findById(playerId).orElse(null);
        if (player == null) {
            logger.warn("Player {} not found", playerId);
            return null;
        }

        if (team == null) {
            logger.warn("Cannot assign player {} to null team", playerId);
            return null;
        }

        logger.info("Before assignment: Player {} has team {}",
                player.getPlayerId(), player.getTeam() != null ? player.getTeam().getTeamId() : "null");

        try {
            // Clear persistence context to avoid stale data
            playerRepository.flush();

            // Approach 1: Use entity manager directly
            player.setTeam(team);
            Player updatedPlayer = playerRepository.saveAndFlush(player);
            logger.info("Approach 1 - After assignment: Player {} has team {}",
                    updatedPlayer.getPlayerId(), updatedPlayer.getTeam() != null ? updatedPlayer.getTeam().getTeamId() : "null");

            // Approach 2: Create a new query to force update
            Player reloadedPlayer = playerRepository.findById(playerId).orElse(null);
            logger.info("Reloaded player: {}, team: {}",
                    reloadedPlayer != null ? reloadedPlayer.getPlayerId() : "null",
                    reloadedPlayer != null && reloadedPlayer.getTeam() != null ? reloadedPlayer.getTeam().getTeamId() : "null");

            if (reloadedPlayer != null) {
                logger.info("Re-assigning player {} to team {}", reloadedPlayer.getPlayerId(), team.getTeamId());
                reloadedPlayer.setTeam(team);
                playerRepository.saveAndFlush(reloadedPlayer);
                logger.info("Approach 2 - After re-assignment: Player {} now has team {}",
                        reloadedPlayer.getPlayerId(),
                        reloadedPlayer.getTeam() != null ? reloadedPlayer.getTeam().getTeamId() : "null");
            }

            return updatedPlayer;
        } catch (Exception e) {
            logger.error("Error occurred during player team assignment: ", e);
            throw e;  // rethrow to trigger transaction rollback
        }
    }


    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    public List<Player> getPlayersByTeamId(Long teamId) {
        return playerRepository.findByTeam_TeamId(teamId);
    }
}


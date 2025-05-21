package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PlayerService {

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


    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    public List<Player> getPlayersByTeamId(Long teamId) {
        return playerRepository.findByTeam_TeamId(teamId);
    }
}


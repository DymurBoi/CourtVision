package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayerById(Integer id) {
        return playerRepository.findById(id).orElse(null);
    }

    public Player createPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player updatePlayer(Integer id, Player updatedPlayer) {
        Player player = getPlayerById(id);
        if (player != null) {
            player.setFname(updatedPlayer.getFname());
            player.setLname(updatedPlayer.getLname());
            player.setEmail(updatedPlayer.getEmail());
            player.setPassword(updatedPlayer.getPassword());
            player.setBirthDate(updatedPlayer.getBirthDate());
            player.setJerseyNum(updatedPlayer.getJerseyNum());
            player.setIsCoach(updatedPlayer.getIsCoach());
            player.setIsAdmin(updatedPlayer.getIsAdmin());
            player.setTeam(updatedPlayer.getTeam());
            return playerRepository.save(player);
        }
        return null;
    }

    public void deletePlayer(Integer id) {
        playerRepository.deleteById(id);
    }

    public List<Player> getPlayersByTeamId(Long teamId) {
        return playerRepository.findByTeam_TeamId(teamId);
    }
}


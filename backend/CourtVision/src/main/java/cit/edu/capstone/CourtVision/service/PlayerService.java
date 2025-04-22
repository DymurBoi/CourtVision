package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final Map<String, String> resetTokens = new HashMap<>();

    public PlayerService(PlayerRepository playerRepository, PasswordEncoder passwordEncoder){
        this.playerRepository=playerRepository;
        this.passwordEncoder=passwordEncoder;
    }

    public Player createPlayer(Player player){
        String encoded = passwordEncoder.encode(player.getPassword());
        player.setPassword(encoded);
        player.setIsCoach(false);
        player.setIsAdmin(false);
        return playerRepository.save(player);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerById(int playerId) {
        return playerRepository.findById(playerId);
    }

    public Player updatePlayer(int playerId, Player updatePlayer){
        return playerRepository.findById(playerId).map(existingPlayer->{
        existingPlayer.setFname(updatePlayer.getFname());
        existingPlayer.setLname(updatePlayer.getLname());
        existingPlayer.setEmail(updatePlayer.getEmail());
        return playerRepository.save(existingPlayer);
        }).orElseThrow(()->new RuntimeException("Player not found."));
    }
    public void deletePlayer(int playerId) {
        playerRepository.deleteById(playerId);
    }

    public Player authenticate(String email, String password) {
        Player player = playerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        if (passwordEncoder.matches(password, player.getPassword())) {
            return player;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public void updatePassword(int playerId, String currentPassword, String newPassword) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        if (!passwordEncoder.matches(currentPassword, player.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        player.setPassword(passwordEncoder.encode(newPassword));
        playerRepository.save(player);
    }
}

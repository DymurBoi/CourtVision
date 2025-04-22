package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.LoginRequest;
import cit.edu.capstone.CourtVision.dto.PasswordUpdateRequest;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.security.JwtTokenProvider;
import cit.edu.capstone.CourtVision.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/player")
public class PlayerController {
    private final PlayerService playerServ;
    private final JwtTokenProvider jwtTokenProvider;

    public PlayerController(PlayerService playerServ, JwtTokenProvider jwtTokenProvider){
        this.playerServ=playerServ;
        this.jwtTokenProvider=jwtTokenProvider;
    }

    @PostMapping("/create")
    public Player createPlayer(@RequestBody Player player){
        return playerServ.createPlayer(player);
    }

    @GetMapping("/getAll")
    public List<Player> getAllPlayers() {
        return playerServ.getAllPlayers();
    }

    @GetMapping("/getById/{playerId}")
    public Optional<Player> getPlayerById(@PathVariable int playerId) {
        return playerServ.getPlayerById(playerId);
    }

    @PutMapping("/update/{playerId}")
    public Player updatePlayer(@PathVariable int playerId,@RequestBody Player updatePlayer){
        return playerServ.updatePlayer(playerId,updatePlayer);
    }

    @DeleteMapping("/delete/{playerId}")
    public void deletePlayer(@PathVariable int playerId) {
        playerServ.deletePlayer(playerId);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Log the email and input password to verify what is being passed
            System.out.println("Attempting login for email: " + loginRequest.getEmail());
            System.out.println("Input password: " + loginRequest.getPassword());
            System.out.println("Input password: " + loginRequest.getPassword());

            // Authenticate the user
            Player player = playerServ.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            // Log the user details for debugging
            System.out.println("Authenticated player: " + player.getEmail());
            System.out.println("DB password: " + player.getPassword());  // This should show the hashed password in DB

            // Generate the token if authentication succeeds
            String token = jwtTokenProvider.generateToken(player);

            // Prepare the response
            Map<String, Object> response = new HashMap<>();
            response.put("player", player);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Catch any exceptions (e.g., invalid email or password) and log relevant details
            System.out.println("Error during authentication: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @PutMapping("/update-password/{userId}")
    public ResponseEntity<?> updatePassword(@PathVariable int playerId, @RequestBody PasswordUpdateRequest request) {
        try {
            playerServ.updatePassword(playerId, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

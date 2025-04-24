package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.JwtResponse;
import cit.edu.capstone.CourtVision.dto.LoginRequest;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Admin;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.repository.CoachRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import cit.edu.capstone.CourtVision.repository.AdminRepository;
import cit.edu.capstone.CourtVision.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PlayerRepository playerRepo;
    @Autowired
    private CoachRepository coachRepo;
    @Autowired
    private AdminRepository adminRepo;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login/player")
    public ResponseEntity<?> loginPlayer(@RequestBody LoginRequest request) {
        Player player = playerRepo.findByEmail(request.getEmail());
        if (player != null && player.getPassword().equals(request.getPassword())) {
            String token = jwtTokenProvider.generateToken(player);
            return ResponseEntity.ok(new JwtResponse(token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials for Player.");
    }

    @PostMapping("/login/coach")
    public ResponseEntity<?> loginCoach(@RequestBody LoginRequest request) {
        Coach coach = coachRepo.findByEmail(request.getEmail());
        if (coach != null && coach.getPassword().equals(request.getPassword())) {
            String token = jwtTokenProvider.generateToken(coach);
            return ResponseEntity.ok(new JwtResponse(token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials for Coach.");
    }

    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) {
        Admin admin = adminRepo.findByEmail(request.getEmail());
        if (admin != null && admin.getPassword().equals(request.getPassword())) {
            String token = jwtTokenProvider.generateToken(admin);
            return ResponseEntity.ok(new JwtResponse(token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials for Admin.");
    }
}

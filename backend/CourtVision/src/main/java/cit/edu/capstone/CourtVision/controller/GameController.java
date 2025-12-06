package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.GameDTO;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.mapper.GameMapper;
import cit.edu.capstone.CourtVision.service.GameService;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService service;
    private GameRepository gameRepository;

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/all")
    public ResponseEntity<List<GameDTO>> getAll() {
        List<Game> games = service.getAll();
        List<GameDTO> dtos = games.stream().map(GameMapper::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<GameDTO> getById(@PathVariable Long id) {
        Game game = service.getById(id);
        return game != null ? ResponseEntity.ok(GameMapper.toDTO(game)) : ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/team/{teamId}")
    public ResponseEntity<List<GameDTO>> getByTeamId(@PathVariable Long teamId) {
        List<Game> games = service.getByTeamId(teamId);
        List<GameDTO> dtos = games.stream().map(GameMapper::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/post")
    public ResponseEntity<?> create(@RequestBody Game game) {
        try {
            Game saved = service.save(game);
            return ResponseEntity.ok(GameMapper.toDTO(saved));
        } catch (Exception e) {
            // Return a meaningful error message to client
            return ResponseEntity.badRequest().body(e.getMessage() != null ? e.getMessage() : "Failed to save game");
        }
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/put/{id}")
    public ResponseEntity<GameDTO> update(@PathVariable Long id, @RequestBody Game game) {
        return ResponseEntity.ok(GameMapper.toDTO(service.update(id, game)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-analysis-type/{gameId}")
    public ResponseEntity<?> updateAnalysisType(@PathVariable Long gameId, @RequestBody Map<String, String> payload) {
        String type = payload.get("type");
        String updatedType = service.updateRecordingType(gameId, type);
        if (updatedType == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok("Game analysis type updated to " + updatedType);
    }

    @PutMapping("/update-final-score/{gameId}")
    public ResponseEntity<?> updateFinalScore(@PathVariable Long gameId, @RequestBody Map<String, String> payload) {
        String finalScore = payload.get("finalScore");
        String updatedFinalScore = service.updateFinalScore(gameId, finalScore);
        if (updatedFinalScore == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok("Game final score: " + updatedFinalScore);
    }
    //try pushing
}
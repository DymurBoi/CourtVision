package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.GameDTO;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.mapper.GameMapper;
import cit.edu.capstone.CourtVision.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService service;

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

    @PostMapping("/post")
    public ResponseEntity<GameDTO> create(@RequestBody Game game) {
        return ResponseEntity.ok(GameMapper.toDTO(service.save(game)));
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
}
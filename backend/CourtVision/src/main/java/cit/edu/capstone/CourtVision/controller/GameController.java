package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.GameDTO;
import cit.edu.capstone.CourtVision.dto.GameMapper;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameService service;

    @GetMapping("/get/all")
    public ResponseEntity<List<GameDTO>> getAll() {
        List<GameDTO> games = service.getAll().stream()
            .map(GameMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(games);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<GameDTO> getById(@PathVariable Long id) {
        Game game = service.getById(id);
        if (game == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(GameMapper.toDto(game));
    }

    @GetMapping("/get/team/{teamId}")
    public ResponseEntity<List<GameDTO>> getByTeamId(@PathVariable Long teamId) {
        List<Game> games = service.getByTeamId(teamId);
        if (games == null) {
            return ResponseEntity.notFound().build();
        }
        List<GameDTO> gameDTOs = games.stream()
            .map(GameMapper::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(gameDTOs);
    }

    @PostMapping("/post")
    public ResponseEntity<GameDTO> create(@RequestBody GameDTO gameDTO) {
        Game game = GameMapper.toEntity(gameDTO);
        Game savedGame = service.save(game);
        return ResponseEntity.ok(GameMapper.toDto(savedGame));
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<GameDTO> update(@PathVariable Long id, @RequestBody GameDTO gameDTO) {
        Game game = GameMapper.toEntity(gameDTO);
        Game updatedGame = service.update(id, game);
        if (updatedGame == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(GameMapper.toDto(updatedGame));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}

package cit.edu.capstone.CourtVision.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import cit.edu.capstone.CourtVision.dto.PlayByPlayDTO;
import cit.edu.capstone.CourtVision.service.PlayByPlayService;

@RestController
@RequestMapping("/api/play-by-play")
public class PlayByPlayController {

    @Autowired
    private PlayByPlayService playByPlayService;

    // Endpoint to create a new play-by-play entry
    @PostMapping
    public ResponseEntity<PlayByPlayDTO> createPlayByPlay(@RequestBody PlayByPlayDTO playByPlayDTO) {
        PlayByPlayDTO savedPlayByPlay = playByPlayService.savePlayByPlay(playByPlayDTO);
        return new ResponseEntity<>(savedPlayByPlay, HttpStatus.CREATED);
    }

    // Endpoint to get all play-by-play records for a specific game
    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<PlayByPlayDTO>> getPlayByPlaysByGame(@PathVariable Long gameId) {
        List<PlayByPlayDTO> playByPlays = playByPlayService.getPlayByPlaysByGame(gameId);
        return new ResponseEntity<>(playByPlays, HttpStatus.OK);
    }

    // Endpoint to get all play-by-play records for a specific player
    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<PlayByPlayDTO>> getPlayByPlaysByPlayer(@PathVariable Long playerId) {
        List<PlayByPlayDTO> playByPlays = playByPlayService.getPlayByPlaysByPlayer(playerId);
        return new ResponseEntity<>(playByPlays, HttpStatus.OK);
    }

    // Endpoint to get all play-by-play records for a specific player in a specific game
    @GetMapping("/game/{gameId}/player/{playerId}")
    public ResponseEntity<List<PlayByPlayDTO>> getPlayByPlaysByGameAndPlayer(
            @PathVariable Long gameId, @PathVariable Long playerId) {
        List<PlayByPlayDTO> playByPlays = playByPlayService.getPlayByPlaysByGameAndPlayer(gameId, playerId);
        return new ResponseEntity<>(playByPlays, HttpStatus.OK);
    }
}


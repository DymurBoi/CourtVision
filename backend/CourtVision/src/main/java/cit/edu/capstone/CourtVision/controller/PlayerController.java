package cit.edu.capstone.CourtVision.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cit.edu.capstone.CourtVision.dto.PlayerDTO;
import cit.edu.capstone.CourtVision.dto.PlayerMapper;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.service.PlayerService;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;
    
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/all")
    public ResponseEntity<List<PlayerDTO>> getAllPlayers() {
    List<Player> players = playerService.getAllPlayers();
    List<PlayerDTO> dtos = players.stream()
                                  .map(PlayerMapper::toDto)
                                  .toList();
    return ResponseEntity.ok(dtos);
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/{id}")
    public ResponseEntity<PlayerDTO> getPlayerById(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id);
        if (player == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(PlayerMapper.toDto(player));
    }


    @PostMapping("/post")
    public Player createPlayer(@RequestBody Player player) {
        return playerService.createPlayer(player);
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PLAYER')")
    @PutMapping("/put/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable Long id, @RequestBody Player updatedPlayer) {
        Player savedPlayer = playerService.updatePlayer(id, updatedPlayer);
        if (savedPlayer == null) return ResponseEntity.notFound().build();
        PlayerDTO dto = PlayerMapper.toDto(savedPlayer);
        return ResponseEntity.ok(dto);
    }


    @DeleteMapping("/delete/{id}")
    public void deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
    }

    @GetMapping("/get/by-team/{teamId}")
    public List<Player> getPlayersByTeamId(@PathVariable Long teamId) {
        return playerService.getPlayersByTeamId(teamId);
    }
    
}


package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.TeamDTO;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.mapper.TeamMapper;
import cit.edu.capstone.CourtVision.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/all")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        List<TeamDTO> dtos = teams.stream()
                .map(TeamMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH') or hasAuthority('ROLE_PLAYER')")
    @GetMapping("/get/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id);
        if (team == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(TeamMapper.toDTO(team));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/post")
    public ResponseEntity<TeamDTO> createTeam(@RequestBody Team team) {
        Team saved = teamService.createTeam(team);
        return ResponseEntity.ok(TeamMapper.toDTO(saved));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/put/{id}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable Long id, @RequestBody Team updated) {
        Team saved = teamService.updateTeam(id, updated);
        if (saved == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(TeamMapper.toDTO(saved));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/{teamId}/add-player")
    public ResponseEntity<Player> addPlayerToTeam(@PathVariable Long teamId, @RequestBody Player player) {
        Player createdPlayer = teamService.addPlayerToTeam(teamId, player);
        return ResponseEntity.ok(createdPlayer);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/{teamId}/add-existing-player/{playerId}")
    public ResponseEntity<Player> assignExistingPlayerToTeam(@PathVariable Long teamId, @PathVariable Long playerId) {
        Player updatedPlayer = teamService.assignPlayerToTeam(teamId, playerId);
        if (updatedPlayer == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updatedPlayer);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/{teamId}/remove-player/{playerId}")
    public ResponseEntity<Void> removePlayerFromTeam(@PathVariable Long teamId, @PathVariable Long playerId) {
    boolean removed = teamService.removePlayerFromTeam(teamId, playerId);
    if (!removed) return ResponseEntity.notFound().build();
    return ResponseEntity.noContent().build();
}

}

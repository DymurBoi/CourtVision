package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping("/get/all")
    public List<Team> getAll() {
        return teamService.getAllTeams();
    }

    @GetMapping("/get/{id}")
    public Team getById(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/post")
    public Team create(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    @PutMapping("/put/{id}")
    public Team update(@PathVariable Long id, @RequestBody Team team) {
        return teamService.updateTeam(id, team);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        teamService.deleteTeam(id);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/{teamId}/add-player")
    public ResponseEntity<Player> addPlayerToTeam(@PathVariable Long teamId, @RequestBody Player player) {
        Player createdPlayer = teamService.addPlayerToTeam(teamId, player);
        return ResponseEntity.ok(createdPlayer);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/{teamId}/add-existing-player/{playerId}")
    public ResponseEntity<Player> addExistingPlayerToTeam(
            @PathVariable Long teamId,
            @PathVariable Long playerId) {

        Player updatedPlayer = teamService.assignPlayerToTeam(teamId, playerId);
        if (updatedPlayer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPlayer);
    }

    @GetMapping("/get/by-admin/{adminId}")
    public List<Team> getByAdmin(@PathVariable int adminId) {
        return teamService.getTeamsByAdminId(adminId);
    }

    @GetMapping("/get/by-coach/{coachId}")
    public List<Team> getByCoach(@PathVariable int coachId) {
        return teamService.getTeamsByCoachId(coachId);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/{teamId}/add-coach/{coachId}")
    public ResponseEntity<Team> addCoachToTeam(
            @PathVariable Long teamId,
            @PathVariable Integer coachId) {

        Team updatedTeam = teamService.addCoachToTeam(teamId, coachId);
        return ResponseEntity.ok(updatedTeam);
    }
}


package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/get/by-admin/{adminId}")
    public List<Team> getByAdmin(@PathVariable int adminId) {
        return teamService.getTeamsByAdminId(adminId);
    }

    @GetMapping("/get/by-coach/{coachId}")
    public List<Team> getByCoach(@PathVariable int coachId) {
        return teamService.getTeamsByCoachId(coachId);
    }
}


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
    private TeamService service;

    @GetMapping
    public List<Team> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Team getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Team create(@RequestBody Team team) {
        return service.save(team);
    }

    @PutMapping("/{id}")
    public Team update(@PathVariable Long id, @RequestBody Team team) {
        return service.update(id, team);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

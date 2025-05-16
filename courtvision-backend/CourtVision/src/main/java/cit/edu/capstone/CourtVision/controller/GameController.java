package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameService service;

    @GetMapping("/get/all")
    public List<Game> getAll() {
        return service.getAll();
    }

    @GetMapping("/get/{id}")
    public Game getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/get/team/{teamId}")
    public List<Game> getByTeamId(@PathVariable Long teamId) {
        return service.getByTeamId(teamId);
    }

    @PostMapping("/post")
    public Game create(@RequestBody Game game) {
        return service.save(game);
    }

    @PutMapping("/put/{id}")
    public Game update(@PathVariable Long id, @RequestBody Game game) {
        return service.update(id, game);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

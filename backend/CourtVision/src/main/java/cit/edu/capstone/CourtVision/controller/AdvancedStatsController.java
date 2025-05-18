package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.service.AdvancedStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/advanced-stats")
public class AdvancedStatsController {

    @Autowired
    private AdvancedStatsService service;

    @GetMapping("/get/all")
    public List<AdvancedStats> getAll() {
        return service.getAll();
    }

    @GetMapping("/get/by-game/{gameId}")
    public AdvancedStats getByGame(@PathVariable Long gameId) {
        return service.getByGameId(gameId);
    }
}

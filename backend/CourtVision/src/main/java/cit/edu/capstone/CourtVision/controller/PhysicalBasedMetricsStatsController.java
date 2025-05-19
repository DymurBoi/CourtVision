package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;
import cit.edu.capstone.CourtVision.service.PhysicalBasedMetricsStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/physical-metrics")
public class PhysicalBasedMetricsStatsController {

    @Autowired
    private PhysicalBasedMetricsStatsService service;

    @GetMapping("/get/all")
    public List<PhysicalBasedMetricsStats> getAll() {
        return service.getAll();
    }

    @GetMapping("/get/{id}")
    public PhysicalBasedMetricsStats getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/get/by-game/{gameId}")
    public PhysicalBasedMetricsStats getByGame(@PathVariable Long gameId) {
        return service.getByGameId(gameId);
    }

    @PutMapping("/put/{id}")
    public PhysicalBasedMetricsStats update(@PathVariable Long id, @RequestBody PhysicalBasedMetricsStats updated) {
        return service.update(id, updated);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

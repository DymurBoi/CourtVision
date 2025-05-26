package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.service.AdvancedStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/get/{id}")
    public ResponseEntity<AdvancedStats> getById(@PathVariable Long id) {
        AdvancedStats stat = service.getById(id);
        return stat != null ? ResponseEntity.ok(stat) : ResponseEntity.notFound().build();
    }

    @PostMapping("/post")
    public AdvancedStats create(@RequestBody AdvancedStats advancedStats) {
        return service.create(advancedStats);
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<AdvancedStats> update(@PathVariable Long id, @RequestBody AdvancedStats advancedStats) {
        AdvancedStats updated = service.update(id, advancedStats);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

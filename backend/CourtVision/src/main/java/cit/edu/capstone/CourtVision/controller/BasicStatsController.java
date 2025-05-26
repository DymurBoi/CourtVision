package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.service.BasicStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/basic-stats")
public class BasicStatsController {

    @Autowired
    private BasicStatsService service;

    @GetMapping("/get/all")
    public ResponseEntity<List<BasicStats>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<BasicStats> getById(@PathVariable Long id) {
        BasicStats stat = service.getById(id);
        return stat != null ? ResponseEntity.ok(stat) : ResponseEntity.notFound().build();
    }

    @PostMapping("/post")
    public ResponseEntity<BasicStats> create(@RequestBody BasicStats stats) {
        return ResponseEntity.ok(service.create(stats));
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<BasicStats> update(@PathVariable Long id, @RequestBody BasicStats stats) {
        BasicStats updated = service.update(id, stats);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

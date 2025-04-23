package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import cit.edu.capstone.CourtVision.service.BasicStatsService;

import java.util.List;

@RestController
@RequestMapping("/api/basic-stats")
public class BasicStatsController {

    @Autowired
    private BasicStatsService service;

    @GetMapping
    public List<BasicStats> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public BasicStats getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public BasicStats create(@RequestBody BasicStats stat) {
        return service.save(stat);
    }

    @PutMapping("/{id}")
    public BasicStats update(@PathVariable Long id, @RequestBody BasicStats stat) {
        return service.update(id, stat);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

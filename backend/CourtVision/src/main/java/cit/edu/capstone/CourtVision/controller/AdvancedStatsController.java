package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.AdvancedStatsDTO;
import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.mapper.AdvancedStatsMapper;
import cit.edu.capstone.CourtVision.service.AdvancedStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/advanced-stats")
public class AdvancedStatsController {

    @Autowired
    private AdvancedStatsService service;

    @GetMapping("/get/all")
    public ResponseEntity<List<AdvancedStatsDTO>> getAll() {
        List<AdvancedStats> statsList = service.getAll();
        List<AdvancedStatsDTO> dtos = statsList.stream()
                .map(AdvancedStatsMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<AdvancedStatsDTO> getById(@PathVariable Long id) {
        AdvancedStats stat = service.getById(id);
        return stat != null
                ? ResponseEntity.ok(AdvancedStatsMapper.toDTO(stat))
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/post")
    public ResponseEntity<AdvancedStatsDTO> create(@RequestBody AdvancedStats advancedStats) {
        AdvancedStats created = service.create(advancedStats);
        return ResponseEntity.ok(AdvancedStatsMapper.toDTO(created));
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<AdvancedStatsDTO> update(@PathVariable Long id, @RequestBody AdvancedStats advancedStats) {
        AdvancedStats updated = service.update(id, advancedStats);
        return updated != null
                ? ResponseEntity.ok(AdvancedStatsMapper.toDTO(updated))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

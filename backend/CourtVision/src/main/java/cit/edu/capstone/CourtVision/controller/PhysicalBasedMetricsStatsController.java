package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.PhysicalBasedMetricsStatsDTO;
import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;
import cit.edu.capstone.CourtVision.mapper.PhysicalBasedMetricsStatsMapper;
import cit.edu.capstone.CourtVision.service.PhysicalBasedMetricsStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/physical-metrics")
public class PhysicalBasedMetricsStatsController {

    @Autowired
    private PhysicalBasedMetricsStatsService service;

    @GetMapping("/get/all")
    public ResponseEntity<List<PhysicalBasedMetricsStatsDTO>> getAll() {
        List<PhysicalBasedMetricsStats> stats = service.getAll();
        List<PhysicalBasedMetricsStatsDTO> dtos = stats.stream().map(PhysicalBasedMetricsStatsMapper::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<PhysicalBasedMetricsStatsDTO> getById(@PathVariable Long id) {
        PhysicalBasedMetricsStats stat = service.getById(id);
        return stat != null ? ResponseEntity.ok(PhysicalBasedMetricsStatsMapper.toDTO(stat)) : ResponseEntity.notFound().build();
    }

    @GetMapping("/get/by-game/{gameId}")
    public ResponseEntity<PhysicalBasedMetricsStatsDTO> getByGame(@PathVariable Long gameId) {
        PhysicalBasedMetricsStats stat = service.getByGameId(gameId);
        return stat != null ? ResponseEntity.ok(PhysicalBasedMetricsStatsMapper.toDTO(stat)) : ResponseEntity.notFound().build();
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<PhysicalBasedMetricsStatsDTO> update(@PathVariable Long id, @RequestBody PhysicalBasedMetricsStats updated) {
        PhysicalBasedMetricsStats saved = service.update(id, updated);
        return saved != null ? ResponseEntity.ok(PhysicalBasedMetricsStatsMapper.toDTO(saved)) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


    // Additional Endpoint

    @GetMapping("/get/by-basic-stats/{basicStatsId}")
    public ResponseEntity<PhysicalBasedMetricsStatsDTO> getByBasicStats(@PathVariable Long basicStatsId) {
        PhysicalBasedMetricsStats stat = service.getByBasicStatsId(basicStatsId);
        return stat != null
                ? ResponseEntity.ok(PhysicalBasedMetricsStatsMapper.toDTO(stat))
                : ResponseEntity.notFound().build();
    }
}
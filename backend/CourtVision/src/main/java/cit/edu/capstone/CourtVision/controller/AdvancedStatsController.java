package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.AdvancedStatsDTO;
import cit.edu.capstone.CourtVision.dto.PhysicalBasedMetricsStatsDTO;
import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;
import cit.edu.capstone.CourtVision.mapper.AdvancedStatsMapper;
import cit.edu.capstone.CourtVision.mapper.PhysicalBasedMetricsStatsMapper;
import cit.edu.capstone.CourtVision.service.AdvancedStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/advanced-stats")
public class AdvancedStatsController {

    @Autowired
    private AdvancedStatsService service;
    
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
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

    //Aditional Endpoint
    @GetMapping("/get/by-game/{gameId}")
    public ResponseEntity<List<AdvancedStatsDTO>> getByGame(@PathVariable Long gameId) {
        List<AdvancedStatsDTO> dtos = service.getByGame(gameId).stream()
                .map(AdvancedStatsMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }



    @GetMapping("/get/by-basic-stats/{basicStatsId}")
    public ResponseEntity<AdvancedStatsDTO> getByBasicStats(@PathVariable Long basicStatsId) {
        AdvancedStats stat = service.getByBasicStatsId(basicStatsId);
        return stat != null
                ? ResponseEntity.ok(AdvancedStatsMapper.toDTO(stat))
                : ResponseEntity.notFound().build();
    }

}

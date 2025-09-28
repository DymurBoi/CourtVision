package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.BasicStatsVariation;
import cit.edu.capstone.CourtVision.mapper.BasicStatsVariationMapper;
import cit.edu.capstone.CourtVision.service.BasicStatsVariationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/basic-stats-var")
public class BasicStatsVariationController {

    @Autowired
    private BasicStatsVariationService service;

    @GetMapping("/get/all")
    public ResponseEntity<List<BasicStatsDTO>> getAll() {
        List<BasicStatsVariation> statsList = service.getAll();
        List<BasicStatsDTO> dtos = statsList.stream()
                .map(BasicStatsVariationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<BasicStatsDTO> getById(@PathVariable Long id) {
        BasicStatsVariation stat = service.getById(id);
        return stat != null
                ? ResponseEntity.ok(BasicStatsVariationMapper.toDTO(stat))
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/get/by-game/{gameId}")
    public List<BasicStatsDTO> getBasicStatsByGameId(@PathVariable Long gameId) {
        return service.getBasicStatsByGameId(gameId);
    }

    @PostMapping("/post")
    public ResponseEntity<BasicStatsDTO> create(@RequestBody BasicStatsVariation stats) {
        BasicStatsVariation created = service.create(stats);
        return ResponseEntity.ok(BasicStatsVariationMapper.toDTO(created));
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<BasicStatsDTO> update(@PathVariable Long id, @RequestBody BasicStatsVariation stats) {
        BasicStatsVariation updated = service.update(id, stats);
        return updated != null
                ? ResponseEntity.ok(BasicStatsVariationMapper.toDTO(updated))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

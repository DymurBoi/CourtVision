package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.dto.BasicStatsVariationDTO;
import cit.edu.capstone.CourtVision.entity.BasicStatsVariation;
import cit.edu.capstone.CourtVision.mapper.BasicStatsVariationMapper;
import cit.edu.capstone.CourtVision.service.BasicStatsVariationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/basic-stats-var")
public class BasicStatsVariationController {

    @Autowired
    private BasicStatsVariationService service;

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
     @GetMapping("/get/all")
    public ResponseEntity<List<BasicStatsVariationDTO>> getAll() {
        List<BasicStatsVariation> statsList = service.getAll();
        List<BasicStatsVariationDTO> dtos = statsList.stream()
                .map(BasicStatsVariationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @GetMapping("/get/{id}")
    public ResponseEntity<BasicStatsVariationDTO> getById(@PathVariable Long id) {
        BasicStatsVariation stat = service.getById(id);
        return stat != null
                ? ResponseEntity.ok(BasicStatsVariationMapper.toDTO(stat))
                : ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @GetMapping("/get/by-game/{gameId}")
    public List<BasicStatsVariationDTO> getBasicStatsByGameId(@PathVariable Long gameId) {
        List<BasicStatsVariation> stats = service.getBasicStatsByGameId(gameId);
        return stats.stream()
                .map(BasicStatsVariationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/post")
    public ResponseEntity<BasicStatsVariationDTO> create(@RequestBody BasicStatsVariationDTO dto) {
        BasicStatsVariation entity = BasicStatsVariationMapper.toEntity(dto);
        BasicStatsVariation created = service.create(entity);
        return ResponseEntity.ok(BasicStatsVariationMapper.toDTO(created));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PutMapping("/put/{id}")
    public ResponseEntity<BasicStatsVariationDTO> update(@PathVariable Long id, @RequestBody BasicStatsVariationDTO dto) {
        BasicStatsVariation entity = BasicStatsVariationMapper.toEntity(dto);
        BasicStatsVariation updated = service.update(id, entity);
        return updated != null
                ? ResponseEntity.ok(BasicStatsVariationMapper.toDTO(updated))
                : ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

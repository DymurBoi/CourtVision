package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.mapper.BasicStatsMapper;
import cit.edu.capstone.CourtVision.service.BasicStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/basic-stats")
public class BasicStatsController {

    @Autowired
    private BasicStatsService service;

   // @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @GetMapping("/get/all")
    public ResponseEntity<List<BasicStatsDTO>> getAll() {
        List<BasicStats> stats = service.getAll();
        List<BasicStatsDTO> dtos = stats.stream().map(BasicStatsMapper::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<BasicStatsDTO> getById(@PathVariable Long id) {
        BasicStats stat = service.getById(id);
        return stat != null ? ResponseEntity.ok(BasicStatsMapper.toDTO(stat)) : ResponseEntity.notFound().build();
    }

    @GetMapping("/get/by-game/{gameId}")
    public ResponseEntity<BasicStatsDTO> getByGame(@PathVariable Long gameId) {
        BasicStats stat = service.getByGameId(gameId);
        return stat != null ? ResponseEntity.ok(BasicStatsMapper.toDTO(stat)) : ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/post")
    public ResponseEntity<BasicStatsDTO> create(@RequestBody BasicStats stat) {
        BasicStats created = service.save(stat);
        return ResponseEntity.ok(BasicStatsMapper.toDTO(created));
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<BasicStatsDTO> update(@PathVariable Long id, @RequestBody BasicStats stat) {
        BasicStats updated = service.update(id, stat);
        return ResponseEntity.ok(BasicStatsMapper.toDTO(updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
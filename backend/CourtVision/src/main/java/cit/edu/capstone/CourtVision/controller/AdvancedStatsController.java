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
//
//    @Autowired
//    private AdvancedStatsService service;
//
//    @GetMapping("/get/all")
//    public ResponseEntity<List<AdvancedStatsDTO>> getAll() {
//        List<AdvancedStats> stats = service.getAll();
//        List<AdvancedStatsDTO> dtos = stats.stream().map(AdvancedStatsMapper::toDTO).collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }
//
//    @GetMapping("/get/by-game/{gameId}")
//    public ResponseEntity<AdvancedStatsDTO> getByGame(@PathVariable Long gameId) {
//        AdvancedStats stat = service.getByGameId(gameId);
//        return stat != null ? ResponseEntity.ok(AdvancedStatsMapper.toDTO(stat)) : ResponseEntity.notFound().build();
//    }
}
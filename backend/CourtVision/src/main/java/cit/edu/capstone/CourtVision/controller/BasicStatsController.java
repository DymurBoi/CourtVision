package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.mapper.BasicStatsMapper;
import cit.edu.capstone.CourtVision.service.BasicStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/basic-stats")
public class BasicStatsController {

    @Autowired
    private BasicStatsService service;

    @GetMapping("/get/all")
    public ResponseEntity<List<BasicStatsDTO>> getAll() {
        List<BasicStats> statsList = service.getAll();
        List<BasicStatsDTO> dtos = statsList.stream()
                .map(BasicStatsMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<BasicStatsDTO> getById(@PathVariable Long id) {
        BasicStats stat = service.getById(id);
        return stat != null
                ? ResponseEntity.ok(BasicStatsMapper.toDTO(stat))
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/get/by-game/{gameId}")
    public List<BasicStatsDTO> getBasicStatsByGameId(@PathVariable Long gameId) {
        return service.getBasicStatsByGameId(gameId);
    }

    @PostMapping("/post")
    public ResponseEntity<BasicStatsDTO> create(@RequestBody BasicStats stats) {
        BasicStats created = service.create(stats);
        return ResponseEntity.ok(BasicStatsMapper.toDTO(created));
    }

    @PutMapping("/put/{id}")
    public ResponseEntity<BasicStatsDTO> update(@PathVariable Long id, @RequestBody BasicStats stats) {
        BasicStats updated = service.update(id, stats);
        return updated != null
                ? ResponseEntity.ok(BasicStatsMapper.toDTO(updated))
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/put-practice/{id}")
    public ResponseEntity<BasicStatsDTO> updatePractice(@PathVariable Long id, @RequestBody BasicStats stats) {
        BasicStats updated = service.updatePractice(id, stats);
        return updated != null
                ? ResponseEntity.ok(BasicStatsMapper.toDTO(updated))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get/subbed-in/{gameId}")
    public List<BasicStatsDTO> getSubbedIn(@PathVariable Long gameId) {
        return service.getSubbedInStats(gameId);
    }

    @GetMapping("/get/subbed-out/{gameId}")
    public List<BasicStatsDTO> getSubbedOut(@PathVariable Long gameId) {
        return service.getSubbedOutStats(gameId);
    }

    @GetMapping("/get/subbed-in/opp-true/{gameId}")
    public List<BasicStatsDTO> getSubbedInStatsOpp(@PathVariable Long gameId) {
        return service.getSubbedInStatsOpp(gameId);
    }

    @GetMapping("/get/subbed-out/opp-true/{gameId}")
    public List<BasicStatsDTO> getSubbedOutStatsOpp(@PathVariable Long gameId) {
        return service.getSubbedOutStatsOpp(gameId);
    }

    @GetMapping("/get/subbed-in/opp-false/{gameId}")
    public List<BasicStatsDTO> getSubbedInStatsOppFalse(@PathVariable Long gameId) {
        return service.getSubbedInStatsOppFalse(gameId);
    }

    @GetMapping("/get/subbed-out/opp-false/{gameId}")
    public List<BasicStatsDTO> getSubbedOutStatsOppFalse(@PathVariable Long gameId) {
        return service.getSubbedOutStatsOppFalse(gameId);
    }

    @GetMapping("/get/opp-false/{gameId}")
    public List<BasicStatsDTO> getOppFalse(@PathVariable Long gameId) {
        return service.getOppFalse(gameId);
    }

    @GetMapping("/get/opp-true/{gameId}")
    public List<BasicStatsDTO> getOppTrue(@PathVariable Long gameId) {
        return service.getOppTrue(gameId);
    }

    @PostMapping("/post/batch")
    public ResponseEntity<List<BasicStatsDTO>> createBatch(@RequestBody List<BasicStats> statsList) {
        List<BasicStats> createdList = service.createBatch(statsList);
        List<BasicStatsDTO> dtos = createdList.stream()
                .map(BasicStatsMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/basic-stats/get/by-game/{gameId}/team/{teamId}")
    public List<BasicStatsDTO> getByGameAndTeam(@PathVariable Long gameId, @PathVariable Long teamId) {
    return service.getByGameAndTeam(gameId, teamId);
}

}

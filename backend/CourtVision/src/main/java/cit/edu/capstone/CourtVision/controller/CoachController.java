package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.CoachDTO;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.mapper.CoachMapper;
import cit.edu.capstone.CourtVision.service.CoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachService coachService;

   
    @GetMapping("/get/all")
    public ResponseEntity<List<CoachDTO>> getAllCoaches() {
        List<Coach> coaches = coachService.getAllCoaches();
        List<CoachDTO> dtos = coaches.stream()
                .map(CoachMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

   
    @GetMapping("/get/{id}")
    public ResponseEntity<CoachDTO> getCoachById(@PathVariable Integer id) {
        Coach coach = coachService.getCoachById(id);
        if (coach == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(CoachMapper.toDTO(coach));
    }

    @PostMapping("/post")
    public Coach createCoach(@RequestBody Coach coach) {
        return coachService.createCoach(coach);
    }

   
    @PutMapping("/put/{id}")
    public ResponseEntity<CoachDTO> updateCoach(@PathVariable Integer id, @RequestBody CoachDTO coachDTO) {
        Coach updated = coachService.updateCoach(id, coachDTO);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(CoachMapper.toDTO(updated));
    }

  
    @DeleteMapping("/delete/{id}")
    public void deleteCoach(@PathVariable Integer id) {
        coachService.deleteCoach(id);
    }


    @GetMapping("/get/by-team/{teamId}")
    public ResponseEntity<List<CoachDTO>> getByTeam(@PathVariable Long teamId) {
        List<Coach> coaches = coachService.getCoachesByTeamId(teamId);
        List<CoachDTO> dtos = coaches.stream()
                .map(CoachMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}

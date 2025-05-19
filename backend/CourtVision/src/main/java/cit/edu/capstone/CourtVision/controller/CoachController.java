package cit.edu.capstone.CourtVision.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cit.edu.capstone.CourtVision.dto.CoachDTO;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.service.CoachService;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachService coachService;

    @GetMapping("/get/all")
    public List<Coach> getAllCoaches() {
        return coachService.getAllCoaches();
    }

    @GetMapping("/get/{id}")
    public Coach getCoachById(@PathVariable Integer id) {
        return coachService.getCoachById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/post")
    public Coach createCoach(@RequestBody Coach coach) {
        return coachService.createCoach(coach);
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/put/{id}")
    public ResponseEntity<Coach> updateCoach(@PathVariable Integer id, @RequestBody CoachDTO coachDTO) {
    Coach updatedCoach = coachService.updateCoach(id, coachDTO);
    if (updatedCoach != null) {
        return ResponseEntity.ok(updatedCoach);
    } else {
        return ResponseEntity.notFound().build();
    }
}


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public void deleteCoach(@PathVariable Integer id) {
        coachService.deleteCoach(id);
    }

    @GetMapping("/get/by-team/{teamId}")
    public List<Coach> getByTeam(@PathVariable Long teamId) {
        return coachService.getCoachesByTeamId(teamId);
    }
}



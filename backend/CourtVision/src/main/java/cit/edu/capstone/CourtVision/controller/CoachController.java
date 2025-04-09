package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.service.CoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachService coachService;

    @GetMapping
    public List<Coach> getAllCoaches() {
        return coachService.getAllCoaches();
    }

    @GetMapping("/{id}")
    public Coach getCoachById(@PathVariable Integer id) {
        return coachService.getCoachById(id).orElse(null);
    }

    @PostMapping
    public Coach createCoach(@RequestBody Coach coach) {
        return coachService.createCoach(coach);
    }

    @PutMapping("/{id}")
    public Coach updateCoach(@PathVariable Integer id, @RequestBody Coach coach) {
        return coachService.updateCoach(id, coach);
    }

    @DeleteMapping("/{id}")
    public void deleteCoach(@PathVariable Integer id) {
        coachService.deleteCoach(id);
    }

    @PostMapping("/login")
    public Coach login(@RequestBody Coach loginRequest) {
        return coachService.login(loginRequest.getEmail(), loginRequest.getPassword());
    }
}


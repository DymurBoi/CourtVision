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

    @GetMapping("/get/all")
    public List<Coach> getAllCoaches() {
        return coachService.getAllCoaches();
    }

    @GetMapping("/get/{id}")
    public Coach getCoachById(@PathVariable Integer id) {
        return coachService.getCoachById(id);
    }

    @PostMapping("/post")
    public Coach createCoach(@RequestBody Coach coach) {
        return coachService.createCoach(coach);
    }

    @PutMapping("/put/{id}")
    public Coach updateCoach(@PathVariable Integer id, @RequestBody Coach coach) {
        return coachService.updateCoach(id, coach);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCoach(@PathVariable Integer id) {
        coachService.deleteCoach(id);
    }

    @GetMapping("/get/by-team/{teamId}")
    public List<Coach> getByTeam(@PathVariable Long teamId) {
        return coachService.getCoachesByTeamId(teamId);
    }
}



package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.PlayerAverages;
import cit.edu.capstone.CourtVision.service.PlayerAveragesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/averages")
public class PlayerAveragesController {

    @Autowired
    private PlayerAveragesService avgService;
/* 
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_COACH')")
    @PostMapping("/calculate/{playerId}")
    public PlayerAverages calculateAndSave(@PathVariable Long playerId) {
        return avgService.calculateAverages(playerId);
    }
*/


     // Calculate and save player averages (trigger recalculation)
   @PostMapping("/calculate/{playerId}")
    public PlayerAverages calculateAndSave(@PathVariable Long playerId) {
        return avgService.calculateAverages(playerId);
    }
    
    @GetMapping("/get/all")
    public List<PlayerAverages> getAll() {
        return avgService.getAll();
    }

    @GetMapping("/get/by-player/{playerId}")
    public PlayerAverages getByPlayer(@PathVariable Long playerId) {
        return avgService.getByPlayerId(playerId);
    }
}
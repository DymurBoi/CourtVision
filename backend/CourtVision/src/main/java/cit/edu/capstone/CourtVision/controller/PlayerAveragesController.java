package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.PlayerAveragesDTO;
import cit.edu.capstone.CourtVision.entity.PlayerAverages;
import cit.edu.capstone.CourtVision.mapper.PlayerAveragesMapper;
import cit.edu.capstone.CourtVision.service.PlayerAveragesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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


  
    // Trigger recalculation and return updated DTO
    @PostMapping("/calculate/{playerId}")
    public PlayerAveragesDTO calculateAndSave(@PathVariable Long playerId) {
        PlayerAverages updated = avgService.updateAverages(playerId);
        return PlayerAveragesMapper.toDTO(updated);
    }

    // Return all averages as DTOs
    @GetMapping("/get/all")
    public List<PlayerAveragesDTO> getAll() {
        return avgService.getAll()
                .stream()
                .map(PlayerAveragesMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Return one player’s averages as DTO
    @GetMapping("/get/by-player/{playerId}")
    public PlayerAveragesDTO getByPlayer(@PathVariable Long playerId) {
        PlayerAverages avg = avgService.getByPlayerId(playerId);
        return avg != null ? PlayerAveragesMapper.toDTO(avg) : null;
    }

    //Player Rankkings by position
        // Rank Point Guards
    @GetMapping("/rank/point-guards/{teamId}")
    public List<PlayerAveragesDTO> rankPointGuards(@PathVariable Long teamId) {
        List<PlayerAverages> players = avgService.rankPointGuards(teamId);
        List<PlayerAveragesDTO> result = new ArrayList<>();
        for (PlayerAverages p : players) {
            result.add(PlayerAveragesMapper.toDTO(p));
        }
        return result;
    }

    // Rank Shooting Guards
    @GetMapping("/rank/shooting-guards/{teamId}")
    public List<PlayerAveragesDTO> rankShootingGuards(@PathVariable Long teamId) {
        List<PlayerAverages> players = avgService.rankShootingGuards(teamId);
        List<PlayerAveragesDTO> result = new ArrayList<>();
        for (PlayerAverages p : players) {
            result.add(PlayerAveragesMapper.toDTO(p));
        }
        return result;
    }

    // Rank Small Forwards
    @GetMapping("/rank/small-forwards/{teamId}")
    public List<PlayerAveragesDTO> rankSmallForwards(@PathVariable Long teamId) {
        List<PlayerAverages> players = avgService.rankSmallForwards(teamId);
        List<PlayerAveragesDTO> result = new ArrayList<>();
        for (PlayerAverages p : players) {
            result.add(PlayerAveragesMapper.toDTO(p));
        }
        return result;
    }

    // Rank Power Forwards
    @GetMapping("/rank/power-forwards/{teamId}")
    public List<PlayerAveragesDTO> rankPowerForwards(@PathVariable Long teamId) {
        List<PlayerAverages> players = avgService.rankPowerForwards(teamId);
        List<PlayerAveragesDTO> result = new ArrayList<>();
        for (PlayerAverages p : players) {
            result.add(PlayerAveragesMapper.toDTO(p));
        }
        return result;
    }

    // Rank Centers
    @GetMapping("/rank/centers/{teamId}")
    public List<PlayerAveragesDTO> rankCenters(@PathVariable Long teamId) {
        List<PlayerAverages> players = avgService.rankCenters(teamId);
        List<PlayerAveragesDTO> result = new ArrayList<>();
        for (PlayerAverages p : players) {
            result.add(PlayerAveragesMapper.toDTO(p));
        }
        return result;
    }
}
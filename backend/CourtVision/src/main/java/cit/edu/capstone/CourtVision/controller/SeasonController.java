package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.Season;
import cit.edu.capstone.CourtVision.service.SeasonService;
import cit.edu.capstone.CourtVision.mapper.GameMapper;
import cit.edu.capstone.CourtVision.dto.GameDTO;
import cit.edu.capstone.CourtVision.entity.Game;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seasons")
public class SeasonController {

    private final SeasonService seasonService;

    public SeasonController(SeasonService seasonService) {
        this.seasonService = seasonService;
    }

    @PostMapping("/start")
    public Season startSeason(@RequestParam String name, @RequestParam Long teamId) {
        return seasonService.startSeason(name, teamId);
    }

    @PostMapping("/{seasonId}/stop")
    public Season stopSeason(@PathVariable Long seasonId) {
        return seasonService.stopSeason(seasonId);
    }

    @GetMapping("/team/{teamId}")
    public List<Season> getSeasonsByTeam(@PathVariable Long teamId) {
        return seasonService.getSeasonsByTeam(teamId);
    }

    @GetMapping("/active")
    public List<Season> getActiveSeasons() {
        return seasonService.getActiveSeasons();
    }

    @GetMapping
    public List<Season> getAllSeasons() {
        return seasonService.getAllSeasons();
    }

    @GetMapping("/{seasonId}")
    public Season getSeasonById(@PathVariable Long seasonId) {
        return seasonService.getSeasonById(seasonId);
    }

    @GetMapping("/{seasonId}/games")
    public List<GameDTO> getGamesBySeason(@PathVariable Long seasonId) {
        List<Game> games = seasonService.getGamesBySeason(seasonId);
        return games.stream().map(GameMapper::toDTO).toList();
    }
}


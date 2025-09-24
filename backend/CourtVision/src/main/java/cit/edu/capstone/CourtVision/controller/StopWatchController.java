package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import cit.edu.capstone.CourtVision.service.StopWatchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stopwatch")
public class StopWatchController {

    @Autowired
    private final StopWatchService stopwatchService;
    @Autowired
    private final BasicStatsRepository basicStatsRepository;

    public StopWatchController(StopWatchService stopwatchService,
                               BasicStatsRepository basicStatsRepository) {
        this.stopwatchService = stopwatchService;
        this.basicStatsRepository = basicStatsRepository;
    }

    // Sub a player in (start/resume)
    @PostMapping("/{basicStatId}/sub-in")
    public String subIn(@PathVariable Long basicStatId) {
        stopwatchService.subIn(basicStatId);
        return "Player " + basicStatId + " subbed in!";
    }

    // Sub a player out (pause + persist elapsed minutes)
    @PostMapping("/{basicStatId}/sub-out")
    public BasicStats subOut(@PathVariable Long basicStatId) {
        BasicStats stats = basicStatsRepository.findById(basicStatId)
                .orElseThrow(() -> new RuntimeException("BasicStats not found"));

        stopwatchService.subOut(basicStatId, stats);

        return basicStatsRepository.save(stats);
    }

    // Optional: Reset the in-memory stopwatch
    @PostMapping("/{basicStatId}/reset")
    public String reset(@PathVariable Long basicStatId) {
        stopwatchService.reset(basicStatId);
        return "Stopwatch for player " + basicStatId + " reset!";
    }
}

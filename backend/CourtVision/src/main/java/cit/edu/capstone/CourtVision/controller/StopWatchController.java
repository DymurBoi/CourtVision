package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.Stopwatch;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import cit.edu.capstone.CourtVision.service.StopWatchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stopwatch")
public class StopWatchController {

    @Autowired
    private final GameRepository gamerepo;
    @Autowired
    private final StopWatchService stopwatchService;
    @Autowired
    private final BasicStatsRepository basicStatsRepository;
    private final Stopwatch stopwatch;

    public StopWatchController(GameRepository gamerepo,
                                StopWatchService stopwatchService,
                               BasicStatsRepository basicStatsRepository,
                               Stopwatch stopwatch) { // 👈 ADD Stopwatch here
        this.gamerepo=gamerepo;
        this.stopwatchService = stopwatchService;
        this.basicStatsRepository = basicStatsRepository;
        this.stopwatch = stopwatch; // 👈 Assign the injected bean
    }

    // Sub a player in (start/resume)
    @PostMapping("/{basicStatId}/sub-in")
    public String subIn(@PathVariable Long basicStatId) {
        stopwatchService.subIn(basicStatId);
        return "Player " + basicStatId + " subbed in!";
    }

    @PostMapping("/sub-in/{gameId}")
    public String startSubIn(@PathVariable Long gameId) {
        stopwatchService.startSubIn(gameId);
        return "Players subbed in!";
    }

   @PostMapping("/subout/{gameId}")
    public ResponseEntity<String> startSubOut(@PathVariable Long gameId) {
        stopwatchService.startSubOut(gameId);
        return ResponseEntity.ok("SubOut started for game " + gameId);
    }

    // Sub a player out (stop and save elapsed to DB)
    @PostMapping("/{basicStatId}/sub-out")
    public BasicStats subOut(@PathVariable Long basicStatId) {
        BasicStats stats = basicStatsRepository.findById(basicStatId)
                .orElseThrow(() -> new RuntimeException("BasicStats not found"));

        stopwatchService.subOut(basicStatId, stats);

        return basicStatsRepository.save(stats);
    }
    
    // Reset stopwatch for a player
    @PostMapping("/{basicStatId}/reset")
    public String reset(@PathVariable Long basicStatId) {
        stopwatchService.reset(basicStatId);
        return "Stopwatch for player " + basicStatId + " reset!";
    }

    // Get live elapsed time (hh:mm:ss format)
    @GetMapping("/{basicStatId}/elapsed")
    public String getElapsed(@PathVariable Long basicStatId) {
        Duration elapsed = stopwatchService.getElapsed(basicStatId);

        long hours = elapsed.toHours();
        long minutes = elapsed.toMinutesPart();
        long seconds = elapsed.toSecondsPart();

        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }

    // Timeout - Pause all subbed-in players
    @PostMapping("/timeout/{gameId}")
    public void timeout(@PathVariable Long gameId) {
        stopwatchService.timeout(gameId);
    }

    //For Handling The time in the frontend
    @PostMapping("/start/{gameId}")
    public void start(@PathVariable Long gameId) {
        stopwatch.start(gameId);
    }
 
    @PostMapping("/stop/{gameId}")
    public void stop(@PathVariable Long gameId) {
        stopwatch.stop(gameId);
    }
 
    @PostMapping("/resetGame")
    public void resetGameStopWatch() {
        stopwatch.reset();
    }
 
    @GetMapping("/state/{gameId}")
    public Map<String, Object> getState(@PathVariable Long gameId) {
        Map<String, Object> state = new HashMap<>();
        state.put("running", stopwatch.isRunning());
        state.put("elapsedTimeMillis", stopwatch.getElapsedTime(gameId).toMillis());
        return state;
    }
    @PutMapping("/{gameId}/edit")
    public ResponseEntity<String> editStopwatch(@PathVariable Long gameId, 
                                                @RequestParam(required = false) Long setElapsedMillis,
                                                @RequestParam(required = false) Boolean pause) {

        // If `pause` is true, stop the stopwatch if it's running
        if (pause != null && pause) {
            stopwatch.stop(gameId);  // Stop the stopwatch
            return ResponseEntity.ok("Stopwatch paused.");
        }

        // If `setElapsedMillis` is provided, manually set the stopwatch time
        if (setElapsedMillis != null) {
            Game game = gamerepo.findByGameId(gameId);
            if (game != null) {
                stopwatch.reset();  // Reset the stopwatch before setting the time
                Duration newElapsed = Duration.ofMillis(setElapsedMillis);
                game.setGameDuration(newElapsed.getSeconds());  // Update game duration with new time
                gamerepo.save(game);
                return ResponseEntity.ok("Stopwatch set to " + formatDuration(newElapsed));
            } else {
                return ResponseEntity.status(404).body("Game not found.");
            }
        }

        // If neither `pause` nor `setElapsedMillis` is provided, resume the stopwatch
        stopwatch.start(gameId);  // Resume the stopwatch
        return ResponseEntity.ok("Stopwatch resumed.");
    }

    // Helper method to format duration in hh:mm:ss
    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        long seconds = duration.toSecondsPart();
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }
}

package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import cit.edu.capstone.CourtVision.util.StopWatch;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StopWatchService {

    // thread-safe map for multiple concurrent requests / scheduler
    private final Map<Long, StopWatch> stopwatches = new ConcurrentHashMap<>();
    private final BasicStatsRepository basicStatsRepository;

    public StopWatchService(BasicStatsRepository basicStatsRepository) {
        this.basicStatsRepository = basicStatsRepository;
    }

    // Sub a player in (start/resume)
    public void subIn(Long basicStatId) {
    StopWatch sw = stopwatches.get(basicStatId);
    BasicStats stats = basicStatsRepository.findById(basicStatId).orElse(null);
    if (stats == null) {
        // Handle this case if needed
        return;
    }

    if (sw == null) {
        sw = new StopWatch();

        // Load existing minutes from DB (persisted total) and set as base
        if (stats.getMinutes() != null) {
            long existingMillis = stats.getMinutes().getTime() + TimeZone.getDefault().getRawOffset();
            sw.setBaseMillis(existingMillis);
        }

        stopwatches.put(basicStatId, sw);
    }

    // Persist subbedIn state regardless
    if (stats.isSubbedIn()==false) {
        stats.setSubbedIn(true);
        basicStatsRepository.save(stats);
    }

    sw.start();
}
public void startSubIn(Long gameId) {
    List<BasicStats> subbedInPlayers=basicStatsRepository.findByGame_GameIdAndSubbedInTrue(gameId);
    for(BasicStats stat: subbedInPlayers){
    StopWatch sw = stopwatches.get(stat.getBasicStatId());
    BasicStats stats = basicStatsRepository.findById(stat.getBasicStatId()).orElse(null);
    if (stats == null) {
        // Handle this case if needed
        return;
    }

    if (sw == null) {
        sw = new StopWatch();

        // Load existing minutes from DB (persisted total) and set as base
        if (stats.getMinutes() != null) {
            long existingMillis = stats.getMinutes().getTime() + TimeZone.getDefault().getRawOffset();
            sw.setBaseMillis(existingMillis);
        }

        stopwatches.put(stat.getBasicStatId(), sw);
    }

    // Persist subbedIn state regardless
    if (stats.isSubbedIn()==false) {
        stats.setSubbedIn(true);
        basicStatsRepository.save(stats);
    }

    sw.start();}
}

    // Sub a player out (stop + persist to DB)
    public void subOut(Long basicStatId, BasicStats stats) {
        StopWatch sw = stopwatches.get(basicStatId);
        if (sw != null) {
            sw.stop();
            updateMinutes(stats, sw);
        }
        if (stats.isSubbedIn()) { // transient check
            stats.setSubbedIn(false); // runtime only
            basicStatsRepository.save(stats);
            }
    }

    // Reset stopwatch for a player (in-memory)
    public void reset(Long basicStatId) {
        StopWatch sw = stopwatches.get(basicStatId);
        if (sw != null) {
            sw.reset();
        }
    }

    // Helper: set DB minutes from stopWatch total elapsed (NO double-add)
    private void updateMinutes(BasicStats stats, StopWatch sw) {
        long totalMillis = sw.getElapsed().toMillis();
        // convert to java.sql.Time (adjust for timezone offset)
        stats.setMinutes(new Time(totalMillis - TimeZone.getDefault().getRawOffset()));
    }

    // Periodic DB update (every 5 seconds) - adjust fixedRate as needed
    @Scheduled(fixedRate = 5000)
    public void updateRunningStopwatches() {
        stopwatches.forEach((basicStatId, sw) -> {
            if (sw.isRunning()) {
                basicStatsRepository.findById(basicStatId).ifPresent(stats -> {
                    updateMinutes(stats, sw);
                    basicStatsRepository.save(stats);
                });
            }
        });
    }

    // Real-time elapsed for UI (returns total including persisted base)
    public Duration getElapsed(Long basicStatId) {
        StopWatch sw = stopwatches.get(basicStatId);
        return (sw != null) ? sw.getElapsed() : Duration.ZERO;
    }
}

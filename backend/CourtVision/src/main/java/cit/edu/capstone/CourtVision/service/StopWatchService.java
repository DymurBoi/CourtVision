package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.util.StopWatch;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Service
public class StopWatchService {

    // One stopwatch per BasicStats record (player in a game)
    private final Map<Long, StopWatch> stopwatches = new HashMap<>();

    public void subIn(Long basicStatId) {
        stopwatches.computeIfAbsent(basicStatId, id -> new StopWatch())
                   .start();
    }

    public void subOut(Long basicStatId, BasicStats stats) {
        StopWatch sw = stopwatches.get(basicStatId);
        if (sw != null) {
            sw.stop();

            long millis = sw.getElapsed().toMillis();

            // java.sql.Time stores a wall-clock time, adjust for timezone offset
            stats.setMinutes(new Time(millis - TimeZone.getDefault().getRawOffset()));
        }
    }

    public void reset(Long basicStatId) {
        StopWatch sw = stopwatches.get(basicStatId);
        if (sw != null) {
            sw.reset();
        }
    }
}

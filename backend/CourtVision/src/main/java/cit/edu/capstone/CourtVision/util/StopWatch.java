package cit.edu.capstone.CourtVision.util;

import java.time.Duration;
import java.time.Instant;

public class StopWatch {
    private Instant startTime;
    private Duration elapsed = Duration.ZERO;     // session-only elapsed (this JVM)
    private long baseMillis = 0L;                 // persisted minutes loaded from DB
    private boolean running = false;

    public void start() {
        if (!running) {
            startTime = Instant.now();
            running = true;
        }
    }

    public void stop() {
        if (running) {
            elapsed = elapsed.plus(Duration.between(startTime, Instant.now()));
            running = false;
        }
    }

    public void reset() {
        elapsed = Duration.ZERO;
        baseMillis = 0L;
        running = false;
    }

    /** 
     * Returns total elapsed time = baseMillis (from DB) + session elapsed.
     */
    public Duration getElapsed() {
        Duration session = running
                ? elapsed.plus(Duration.between(startTime, Instant.now()))
                : elapsed;
        return Duration.ofMillis(baseMillis).plus(session);
    }

    public boolean isRunning() {
        return running;
    }

    /** Set persisted base millis (call when you create the stopwatch from DB) */
    public void setBaseMillis(long baseMillis) {
        this.baseMillis = baseMillis;
    }

    public long getBaseMillis() {
        return baseMillis;
    }

    /** Add session-only elapsed (rarely needed) */
    public void addElapsed(Duration duration) {
        this.elapsed = this.elapsed.plus(duration);
    }
}

package cit.edu.capstone.CourtVision.util;
import java.time.Duration;
import java.time.Instant;

public class StopWatch {
    private Instant startTime;
    private Duration elapsed = Duration.ZERO;
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
        running = false;
    }

    public Duration getElapsed() {
        return running
                ? elapsed.plus(Duration.between(startTime, Instant.now()))
                : elapsed;
    }

    public boolean isRunning() { return running; }
}

package cit.edu.capstone.CourtVision.entity;

import java.time.Instant;
import java.time.Duration;


public class Stopwatch {
    private Instant startTime;
    private Duration elapsedTime = Duration.ZERO;
    private boolean running = false;
 
    public synchronized void start() {
        if (!running) {
            startTime = Instant.now();
            running = true;
        }
    }
 
    public synchronized void stop() {
        if (running) {
            elapsedTime = elapsedTime.plus(Duration.between(startTime, Instant.now()));
            running = false;
        }
    }
 
    public synchronized void reset() {
        startTime = null;
        elapsedTime = Duration.ZERO;
        running = false;
    }
 
    public synchronized Duration getElapsedTime() {
        if (running) {
            return elapsedTime.plus(Duration.between(startTime, Instant.now()));
        } else {
            return elapsedTime;
        }
    }
 
    public synchronized boolean isRunning() {
        return running;
    }
}

package cit.edu.capstone.CourtVision.entity;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cit.edu.capstone.CourtVision.repository.GameRepository;

@Component
public class Stopwatch {

    private Instant startTime;
    private boolean running = false;

    @Autowired
    private GameRepository gameRepository;

    public synchronized void start(Long gameId) {
        if (!running) {
            Game game = gameRepository.findByGameId(gameId);
            Long savedDuration = game.getGameDuration();

            if (savedDuration == null || savedDuration == 0L) {
                // Start fresh
                startTime = Instant.now();
            } else {
                // Resume from where we left off
                startTime = Instant.now().minusSeconds(savedDuration);
            }

            running = true;
        }
    }


    public synchronized void stop(Long gameId) {
        if (running) {
            Game game = gameRepository.findByGameId(gameId);
            Duration previousDuration = Duration.ofSeconds(game.getGameDuration() != null ? game.getGameDuration() : 0);
            Duration sessionDuration = Duration.between(startTime, Instant.now());
            Duration newTotalDuration = previousDuration.plus(sessionDuration);
            game.setGameDuration(newTotalDuration.getSeconds());
            gameRepository.save(game); // persist the updated duration
            running = false;
        }
    }

    public synchronized void reset() {
        startTime = null;
        running = false;
    }

    public synchronized Duration getElapsedTime(Long gameId) {
        Game game = gameRepository.findByGameId(gameId);
        long gameDurationSeconds = game.getGameDuration() != null ? game.getGameDuration() : 0;

        if (running) {
            Duration previousDuration = Duration.ofSeconds(gameDurationSeconds);
            Duration sessionDuration = Duration.between(startTime, Instant.now());
            return previousDuration.plus(sessionDuration);
        } else {
            return Duration.ofSeconds(gameDurationSeconds);
        }
    }

    public synchronized boolean isRunning() {
        return running;
    }
}

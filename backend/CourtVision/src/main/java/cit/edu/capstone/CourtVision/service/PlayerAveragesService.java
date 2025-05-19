package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerAveragesService {

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private PlayerRepository playerRepo;

    @Autowired
    private PlayerAveragesRepository averagesRepo;

    public PlayerAverages calculateAverages(Long playerId) {
        Player player = playerRepo.findById(playerId).orElse(null);
        if (player == null) return null;

        List<Game> games = gameRepo.findByPlayerAveragesPlayer(player);
        if (games.isEmpty()) return null;

        int totalGames = games.size();
        double totalPoints = 0, totalAssists = 0, totalRebounds = 0, totalSteals = 0, totalBlocks = 0, totalMinutes = 0;
        double totalTS = 0, totalUSG = 0, totalORTG = 0, totalDRTG = 0;
        int advStatsCount = 0;

        for (Game game : games) {
            BasicStats basic = game.getBasicStats();
            if (basic != null) {
                totalPoints += (basic.getTwoPtMade() * 2) + (basic.getThreePtMade() * 3) + basic.getFtMade();
                totalAssists += basic.getAssists();
                totalRebounds += basic.getoFRebounds() + basic.getdFRebounds();
                totalSteals += basic.getSteals();
                totalBlocks += basic.getBlocks();
                totalMinutes += basic.getMinutes().toLocalTime().toSecondOfDay() / 60.0;
            }
        }

        PlayerAverages avg = new PlayerAverages();
        avg.setPlayer(player);
        avg.setPointsPerGame(totalPoints / totalGames);
        avg.setAssistsPerGame(totalAssists / totalGames);
        avg.setReboundsPerGame(totalRebounds / totalGames);
        avg.setStealsPerGame(totalSteals / totalGames);
        avg.setBlocksPerGame(totalBlocks / totalGames);
        avg.setMinutesPerGame(totalMinutes / totalGames);
        avg.setTrueShootingPercentage(advStatsCount > 0 ? totalTS / advStatsCount : 0);
        avg.setUsagePercentage(advStatsCount > 0 ? totalUSG / advStatsCount : 0);
        avg.setOffensiveRating(advStatsCount > 0 ? totalORTG / advStatsCount : 0);
        avg.setDefensiveRating(advStatsCount > 0 ? totalDRTG / advStatsCount : 0);

        return averagesRepo.save(avg);
    }

    public List<PlayerAverages> getAll() {
        return averagesRepo.findAll();
    }

    public PlayerAverages getByPlayerId(Long playerId) {
        Player player = playerRepo.findById(playerId).orElse(null);
        return player != null ? averagesRepo.findByPlayer(player) : null;
    }
}
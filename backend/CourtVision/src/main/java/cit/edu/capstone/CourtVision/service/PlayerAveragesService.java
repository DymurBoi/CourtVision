package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerAveragesService {

    @Autowired
    private BasicStatsRepository basicStatsRepo;

    @Autowired
    private PlayerRepository playerRepo;

    @Autowired
    private PlayerAveragesRepository averagesRepo;

    // Calculate averages directly from BasicStats by playerId
    public PlayerAverages calculateAverages(Long playerId) {
        Player player = playerRepo.findById(playerId).orElse(null);
        if (player == null) return null;

        // Fetch all BasicStats linked to this player
        List<BasicStats> statsList = basicStatsRepo.findByPlayerPlayerId(playerId);
        if (statsList == null || statsList.isEmpty()) return null;

        int totalGames = statsList.size();
        double totalPoints = 0, totalAssists = 0, totalRebounds = 0;
        double totalSteals = 0, totalBlocks = 0, totalMinutes = 0;

        for (BasicStats basic : statsList) {
            totalPoints += (basic.getTwoPtMade() * 2) + (basic.getThreePtMade() * 3) + basic.getFtMade();
            totalAssists += basic.getAssists();
            totalRebounds += basic.getoFRebounds() + basic.getdFRebounds();
            totalSteals += basic.getSteals();
            totalBlocks += basic.getBlocks();
            if (basic.getMinutes() != null)
                totalMinutes += basic.getMinutes().toLocalTime().toSecondOfDay() / 60.0;
        }

        PlayerAverages avg = new PlayerAverages();
        avg.setPlayer(player);
        avg.setBasicStats(statsList);
        avg.setPointsPerGame(totalPoints / totalGames);
        avg.setAssistsPerGame(totalAssists / totalGames);
        avg.setReboundsPerGame(totalRebounds / totalGames);
        avg.setStealsPerGame(totalSteals / totalGames);
        avg.setBlocksPerGame(totalBlocks / totalGames);
        avg.setMinutesPerGame(totalMinutes / totalGames);

        // Optional: set these as placeholders (can extend later)
        avg.setTrueShootingPercentage(0.0);
        avg.setUsagePercentage(0.0);
        avg.setOffensiveRating(0.0);
        avg.setDefensiveRating(0.0);

        return averagesRepo.save(avg);
    }

    public List<PlayerAverages> getAll() {
        return averagesRepo.findAll();
    }

    public PlayerAverages getByPlayerId(Long playerId) {
        Player player = playerRepo.findById(playerId).orElse(null);
        return player != null ? averagesRepo.findByPlayer(player) : null;
    }

    public PlayerAverages update(Long id, PlayerAverages updated) {
        PlayerAverages existing = averagesRepo.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setPointsPerGame(updated.getPointsPerGame());
        existing.setAssistsPerGame(updated.getAssistsPerGame());
        existing.setReboundsPerGame(updated.getReboundsPerGame());
        existing.setStealsPerGame(updated.getStealsPerGame());
        existing.setBlocksPerGame(updated.getBlocksPerGame());
        existing.setMinutesPerGame(updated.getMinutesPerGame());
        existing.setTrueShootingPercentage(updated.getTrueShootingPercentage());
        existing.setUsagePercentage(updated.getUsagePercentage());
        existing.setOffensiveRating(updated.getOffensiveRating());
        existing.setDefensiveRating(updated.getDefensiveRating());

        return averagesRepo.save(existing);
    }

    public void delete(Long id) {
        averagesRepo.deleteById(id);
    }
}

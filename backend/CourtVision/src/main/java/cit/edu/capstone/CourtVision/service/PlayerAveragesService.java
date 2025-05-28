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

    /**
     * Called when a new Player is created.
     * Creates an empty PlayerAverages with zero stats.
     */
    public PlayerAverages createInitialAveragesForPlayer(Player player) {
        PlayerAverages avg = new PlayerAverages();
        avg.setPlayer(player);
        avg.setPointsPerGame(0);
        avg.setAssistsPerGame(0);
        avg.setReboundsPerGame(0);
        avg.setStealsPerGame(0);
        avg.setBlocksPerGame(0);
        avg.setMinutesPerGame(0);
        avg.setTrueShootingPercentage(0);
        avg.setUsagePercentage(0);
        avg.setOffensiveRating(0);
        avg.setDefensiveRating(0);

        return averagesRepo.save(avg);
    }

    /**
     * Called whenever BasicStats are created or updated.
     * Recalculates the player's averages from all their BasicStats.
     */
    public PlayerAverages updateAverages(Long playerId) {
    Player player = playerRepo.findById(playerId).orElse(null);
    if (player == null) return null;

    List<BasicStats> statsList = basicStatsRepo.findByPlayer(player);
    if (statsList == null || statsList.isEmpty()) return null;

    int totalGames = statsList.size();
    double totalPoints = 0, totalAssists = 0, totalRebounds = 0;
    double totalSteals = 0, totalBlocks = 0, totalMinutes = 0;

    double totalFGA = 0, totalFGM = 0, totalFTA = 0, totalFTM = 0, totalThreePA = 0, totalThreePM = 0;
    double totalTurnovers = 0;

    for (BasicStats b : statsList) {
        totalPoints += (b.getTwoPtMade() * 2) + (b.getThreePtMade() * 3) + b.getFtMade();
        totalAssists += b.getAssists();
        totalRebounds += b.getoFRebounds() + b.getdFRebounds();
        totalSteals += b.getSteals();
        totalBlocks += b.getBlocks();
        if (b.getMinutes() != null)
            totalMinutes += b.getMinutes().toLocalTime().toSecondOfDay() / 60.0;

        totalFGA += b.getTwoPtAttempts() + b.getThreePtAttempts();
        totalFGM += b.getTwoPtMade() + b.getThreePtMade();
        totalFTA += b.getFtAttempts();
        totalFTM += b.getFtMade();
        totalThreePA += b.getThreePtAttempts();
        totalThreePM += b.getThreePtMade();
        totalTurnovers += b.getTurnovers();
    }

    PlayerAverages avg = averagesRepo.findByPlayer(player);
    if (avg == null) {
        avg = new PlayerAverages();
        avg.setPlayer(player);
    }

    avg.setPointsPerGame(totalPoints / totalGames);
    avg.setAssistsPerGame(totalAssists / totalGames);
    avg.setReboundsPerGame(totalRebounds / totalGames);
    avg.setStealsPerGame(totalSteals / totalGames);
    avg.setBlocksPerGame(totalBlocks / totalGames);
    avg.setMinutesPerGame(totalMinutes / totalGames);

    // True Shooting Percentage (TS%)
    double tsDenominator = (2 * (totalFGA + 0.44 * totalFTA));
    double ts = tsDenominator != 0 ? totalPoints / tsDenominator : 0;
    avg.setTrueShootingPercentage(ts * 100);

    // Usage Percentage (estimated: FGA + TOV + 0.44 * FTA per minute)
    double usageNumerator = totalFGA + totalTurnovers + 0.44 * totalFTA;
    double usage = totalMinutes != 0 ? usageNumerator / totalMinutes : 0;
    avg.setUsagePercentage(usage * 100);

    // Offensive Rating & Defensive Rating → you **don’t** have team-based or possession-based data,
    // so we’ll default to 0 or just leave them for future expansion.
    avg.setOffensiveRating(0);
    avg.setDefensiveRating(0);

    return averagesRepo.save(avg);
}


    public List<PlayerAverages> getAll() {
        return averagesRepo.findAll();
    }

    public PlayerAverages getByPlayerId(Long playerId) {
        Player player = playerRepo.findById(playerId).orElse(null);
        return player != null ? averagesRepo.findByPlayer(player) : null;
    }

    public void delete(Long id) {
        averagesRepo.deleteById(id);
    }
}

package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PhysicalBasedMetricsStatsService {

    @Autowired
    private PhysicalBasedMetricsStatsRepository metricsRepo;

    @Autowired
    private PhysicalRecordsRepository physicalRepo;

    @Autowired
    private GameRepository gameRepo;
    @Autowired
    private BasicStatsRepository basicStatsRepo;

    // Get All
    public List<PhysicalBasedMetricsStats> getAll() {
        return metricsRepo.findAll();
    }

    // Get by ID
    public PhysicalBasedMetricsStats getById(Long id) {
        return metricsRepo.findById(id).orElse(null);
    }

    //Get by Game ID
    public PhysicalBasedMetricsStats getByGameId(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? metricsRepo.findByGame(game) : null;
    }

    //Create from BasicStats
    public PhysicalBasedMetricsStats createFrom(BasicStats basicStats) {
        if (basicStats == null || basicStats.getGame() == null) return null;

        Game game = basicStats.getGame();
        Team team = game.getTeam();
        if (team == null || team.getPlayers() == null || team.getPlayers().isEmpty()) return null;

        Player player = team.getPlayers().get(0); // You can improve this by linking the actual player in the future

        PhysicalRecords record = physicalRepo.findByPlayer(player);
        if (record == null) return null;

        PhysicalBasedMetricsStats stats = computeMetrics(record);
        stats.setBasicStats(basicStats);
        stats.setGame(game);
        stats.setPhysicalRecord(record);

        return metricsRepo.save(stats);
    }

    //Update by ID
    public PhysicalBasedMetricsStats update(Long id, PhysicalBasedMetricsStats updated) {
        PhysicalBasedMetricsStats existing = metricsRepo.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setAthleticPerformanceIndex(updated.getAthleticPerformanceIndex());
        existing.setDefensiveDisruptionRating(updated.getDefensiveDisruptionRating());
        existing.setReboundPotentialIndex(updated.getReboundPotentialIndex());
        existing.setMobilityAdjustedBuildScore(updated.getMobilityAdjustedBuildScore());
        existing.setPositionSuitabilityIndex(updated.getPositionSuitabilityIndex());

        return metricsRepo.save(existing);
    }

    //Delete by ID
    public void delete(Long id) {
        metricsRepo.deleteById(id);
    }

    //Delete by Game
    public void deleteByGame(Game game) {
        PhysicalBasedMetricsStats stats = metricsRepo.findByGame(game);
        if (stats != null) {
            metricsRepo.delete(stats);
        }
    }

    //Metric Computation
    private PhysicalBasedMetricsStats computeMetrics(PhysicalRecords record) {
        BigDecimal height = record.getHeight();
        BigDecimal wingspan = record.getWingspan();
        BigDecimal vertical = record.getVertical();
        BigDecimal weight = record.getWeight();

        double Z_vert = vertical.doubleValue();
        double Z_speed = 1.0; // Placeholder
        double Z_agility = 1.0; // Placeholder
        double Z_wingspan = wingspan.doubleValue();

        double api = (Z_vert + Z_speed + Z_agility + Z_wingspan) / 4;
        double ddr = (1 + 1) * (wingspan.doubleValue() / height.doubleValue() + 1.0) / 2;
        double rpi = (height.doubleValue() + 0.5 * wingspan.doubleValue()) / weight.doubleValue();
        double mabs = (height.doubleValue() + wingspan.doubleValue()) / weight.doubleValue();
        double psi = (wingspan.doubleValue() / height.doubleValue()) + 2.0; // 1 + 1 as constant part

        PhysicalBasedMetricsStats stats = new PhysicalBasedMetricsStats();
        stats.setAthleticPerformanceIndex(api);
        stats.setDefensiveDisruptionRating(ddr);
        stats.setReboundPotentialIndex(rpi);
        stats.setMobilityAdjustedBuildScore(mabs);
        stats.setPositionSuitabilityIndex(psi);

        return stats;
    }
    public PhysicalBasedMetricsStats getByBasicStatsId(Long basicStatsId) {
        BasicStats basic = basicStatsRepo.findById(basicStatsId).orElse(null);
        return basic != null ? metricsRepo.findByBasicStats(basic) : null;
    }

    //delete by basicstats
    public void deleteByBasicStats(BasicStats basicStats) {
        PhysicalBasedMetricsStats stats = metricsRepo.findByBasicStats(basicStats);
        if (stats != null) {
            metricsRepo.delete(stats);
        }
    }
}
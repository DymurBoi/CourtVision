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

    public List<PhysicalBasedMetricsStats> getAll() {
        return metricsRepo.findAll();
    }

    public PhysicalBasedMetricsStats getById(Long id) {
        return metricsRepo.findById(id).orElse(null);
    }

    public PhysicalBasedMetricsStats getByGameId(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? metricsRepo.findByGame(game) : null;
    }

    public PhysicalBasedMetricsStats createFrom(BasicStats basicStats) {
        Game game = basicStats.getGame();
        if (game == null) return null;

        Player player = game.getTeam() != null && game.getTeam().getPlayers() != null
                ? game.getTeam().getPlayers().stream().findFirst().orElse(null)
                : null;

        if (player == null) return null;

        PhysicalRecords record = physicalRepo.findByPlayer(player);
        if (record == null) return null;

        PhysicalBasedMetricsStats stats = computeMetrics(record);
        stats.setBasicStats(basicStats);
        stats.setGame(game);
        stats.setPhysicalRecord(record);

        return metricsRepo.save(stats);
    }

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

    public void delete(Long id) {
        metricsRepo.deleteById(id);
    }

    public void deleteByGame(Game game) {
        PhysicalBasedMetricsStats stats = metricsRepo.findByGame(game);
        if (stats != null) {
            metricsRepo.delete(stats);
        }
    }

    private PhysicalBasedMetricsStats computeMetrics(PhysicalRecords record) {
        BigDecimal height = record.getHeight();
        BigDecimal wingspan = record.getWingspan();
        BigDecimal vertical = record.getVertical();
        BigDecimal weight = record.getWeight();

        double Z_vert = vertical.doubleValue();
        double Z_speed = 1.0;
        double Z_agility = 1.0;
        double Z_wingspan = wingspan.doubleValue();

        double api = (Z_vert + Z_speed + Z_agility + Z_wingspan) / 4;
        double ddr = (1 + 1) * (wingspan.doubleValue() / height.doubleValue() + 1.0) / 2;
        double rpi = (height.doubleValue() + 0.5 * wingspan.doubleValue()) / weight.doubleValue();
        double mabs = (height.doubleValue() + wingspan.doubleValue()) / weight.doubleValue();
        double psi = (wingspan.doubleValue() / height.doubleValue()) + 1 + 1;

        PhysicalBasedMetricsStats stats = new PhysicalBasedMetricsStats();
        stats.setAthleticPerformanceIndex(api);
        stats.setDefensiveDisruptionRating(ddr);
        stats.setReboundPotentialIndex(rpi);
        stats.setMobilityAdjustedBuildScore(mabs);
        stats.setPositionSuitabilityIndex(psi);

        return stats;
    }
}

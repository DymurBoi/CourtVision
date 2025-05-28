package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalTime;
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

    public List<PhysicalBasedMetricsStats> getAll() {
        return metricsRepo.findAll();
    }

    public PhysicalBasedMetricsStats getById(Long id) {
        return metricsRepo.findById(id).orElse(null);
    }

    public List<PhysicalBasedMetricsStats> getByGameId(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? metricsRepo.findByGame(game) : List.of();
    }

    public PhysicalBasedMetricsStats createFrom(BasicStats basicStats) {
        if (basicStats == null || basicStats.getGame() == null) return null;

        Game game = basicStats.getGame();
        Team team = game.getTeam();
        if (team == null || team.getPlayers() == null || team.getPlayers().isEmpty()) return null;

        Player player = team.getPlayers().get(0);  // TODO: Adjust to match correct player

        PhysicalRecords record = physicalRepo.findByPlayer(player);
        if (record == null) return null;

        PhysicalBasedMetricsStats stats = computeMetrics(record, basicStats);
        stats.setBasicStats(basicStats);
        stats.setGame(game);
        stats.setPhysicalRecord(record);

        return metricsRepo.save(stats);
    }

    public PhysicalBasedMetricsStats update(Long id, PhysicalBasedMetricsStats updated) {
        PhysicalBasedMetricsStats existing = metricsRepo.findById(id).orElse(null);
        if (existing == null) return null;

        existing.setFinishingEfficiency(updated.getFinishingEfficiency());
        existing.setReboundingEfficiency(updated.getReboundingEfficiency());
        existing.setDefensiveActivityIndex(updated.getDefensiveActivityIndex());
        existing.setPhysicalEfficiencyRating(updated.getPhysicalEfficiencyRating());

        return metricsRepo.save(existing);
    }

    public void delete(Long id) {
        metricsRepo.deleteById(id);
    }

    public void deleteByGame(Game game) {
        PhysicalBasedMetricsStats stats = metricsRepo.findSingleByGame(game);
        if (stats != null) {
            metricsRepo.delete(stats);
        }
    }

    private PhysicalBasedMetricsStats computeMetrics(PhysicalRecords record, BasicStats basicStats) {
        double height = record.getHeight().doubleValue();
        double wingspan = record.getWingspan().doubleValue();
        double vertical = record.getVertical().doubleValue();
        double weight = record.getWeight().doubleValue();

        double twoPtAttempts = basicStats.getTwoPtAttempts();
        double twoPtMade = basicStats.getTwoPtMade();
        double threePtAttempts = basicStats.getThreePtAttempts();
        double ftAttempts = basicStats.getFtAttempts();
        double gamePoints = basicStats.getGamePoints();
        double assists = basicStats.getAssists();
        double oFRebounds = basicStats.getoFRebounds();
        double dFRebounds = basicStats.getdFRebounds();
        double blocks = basicStats.getBlocks();
        double steals = basicStats.getSteals();
        double turnovers = basicStats.getTurnovers();

        LocalTime minutesTime = basicStats.getMinutes().toLocalTime();
        long minutesInSeconds = minutesTime.toSecondOfDay();

        double wingspanToHeightRatio = wingspan / height / 1.06;

        double finishingEfficiency = (twoPtAttempts > 0)
                ? (twoPtMade / twoPtAttempts) / (0.52 + 0.25 * (vertical / 34) + 0.1 * wingspanToHeightRatio)
                : 0;

        double reboundingEfficiency = (minutesInSeconds > 0)
                ? ((oFRebounds + dFRebounds) / minutesInSeconds)
                / (0.008 + 0.02 * wingspanToHeightRatio + 0.015 * (vertical / 34))
                : 0;

        double defensiveActivityIndex = (blocks + steals)
                / (1.0 + 0.25 * wingspanToHeightRatio + 0.15 * (vertical / 34));

        double tsAttempts = twoPtAttempts + threePtAttempts + 0.44 * ftAttempts;
        double tsPct = (tsAttempts > 0) ? gamePoints / (2.0 * tsAttempts) : 0;

        double PER_Lite = (tsPct + 0.45 * assists + 0.35 * (oFRebounds + dFRebounds) +
                0.6 * (steals + blocks) - 0.5 * turnovers) *
                (0.5 + 0.5 * finishingEfficiency);

        PhysicalBasedMetricsStats stats = new PhysicalBasedMetricsStats();
        stats.setFinishingEfficiency(finishingEfficiency);
        stats.setReboundingEfficiency(reboundingEfficiency);
        stats.setDefensiveActivityIndex(defensiveActivityIndex);
        stats.setPhysicalEfficiencyRating(PER_Lite);

        return stats;
    }

    public PhysicalBasedMetricsStats getByBasicStatsId(Long basicStatsId) {
        BasicStats basic = basicStatsRepo.findById(basicStatsId).orElse(null);
        return basic != null ? metricsRepo.findByBasicStats(basic) : null;
    }

    public void deleteByBasicStats(BasicStats basicStats) {
        PhysicalBasedMetricsStats stats = metricsRepo.findByBasicStats(basicStats);
        if (stats != null) {
            metricsRepo.delete(stats);
        }
    }
}

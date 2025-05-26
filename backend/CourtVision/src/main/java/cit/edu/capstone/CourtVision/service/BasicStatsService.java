package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BasicStatsService {

    @Autowired
    private BasicStatsRepository basicStatsRepository;

    @Autowired
    private AdvancedStatsRepository advancedStatsRepository;

    @Autowired
    private PhysicalBasedMetricsStatsRepository physicalMetricsRepository;

    @Autowired
    private PhysicalRecordsRepository physicalRecordsRepository;

    public List<BasicStats> getAll() {
        return basicStatsRepository.findAll();
    }

    public BasicStats getById(Long id) {
        return basicStatsRepository.findById(id).orElse(null);
    }

    public BasicStats create(BasicStats basicStats) {
        // Save the BasicStats first (so we get its ID)
        BasicStats savedBasic = basicStatsRepository.save(basicStats);

        // 🔹 Calculate and save AdvancedStats (with formulas)
        AdvancedStats advanced = calculateAdvancedStats(savedBasic);
        advanced.setBasicStats(savedBasic);
        advancedStatsRepository.save(advanced);

        // 🔹 Calculate and save PhysicalBasedMetricsStats (with player physical data)
        PhysicalBasedMetricsStats physicalMetrics = calculatePhysicalMetrics(savedBasic);
        if (physicalMetrics != null) {
            physicalMetrics.setGame(savedBasic.getGame());
            physicalMetricsRepository.save(physicalMetrics);
        }

        return savedBasic;
    }

    public BasicStats update(Long id, BasicStats updatedStats) {
        BasicStats existing = getById(id);
        if (existing != null) {
            updatedStats.setBasicStatId(id);
            return basicStatsRepository.save(updatedStats);
        }
        return null;
    }

    public void delete(Long id) {
        basicStatsRepository.deleteById(id);
    }

    // ───────────────────────────────────────────────
    // Calculate AdvancedStats from BasicStats
    private AdvancedStats calculateAdvancedStats(BasicStats b) {
        double minutes = b.getMinutes().toLocalTime().toSecondOfDay() / 60.0;
        if (minutes == 0) minutes = 1;

        int FGM = b.getTwoPtMade() + b.getThreePtMade();
        int FGA = b.getTwoPtAttempts() + b.getThreePtAttempts();
        int TPM = b.getThreePtMade();
        int FTM = b.getFtMade();
        int FTA = b.getFtAttempts();
        int ORB = b.getoFRebounds();
        int DRB = b.getdFRebounds();
        int AST = b.getAssists();
        int STL = b.getSteals();
        int BLK = b.getBlocks();
        int PF = b.getpFouls();
        int TOV = b.getTurnovers();
        int PTS = 2 * b.getTwoPtMade() + 3 * b.getThreePtMade() + b.getFtMade();

        AdvancedStats a = new AdvancedStats();

        a.setuPER((FGM + 0.5 * TPM - FGA + 0.5 * FTM - FTA + ORB + 0.5 * DRB + AST + STL + 0.5 * BLK - PF - TOV) / minutes);
        a.seteFG(FGA != 0 ? (FGM + 0.5 * TPM) / (double) FGA : 0);
        a.setTs((FGA + 0.44 * FTA) != 0 ? PTS / (2.0 * (FGA + 0.44 * FTA)) : 0);
        a.setUsg(0);
        a.setAssistRatio((FGA + 0.44 * FTA + TOV) != 0 ? 100 * AST / (FGA + 0.44 * FTA + TOV) : 0);
        a.setTurnoverRatio((FGA + 0.44 * FTA + AST + TOV) != 0 ? 100 * TOV / (FGA + 0.44 * FTA + AST + TOV) : 0);
        a.setPie(0);
        a.setOrtg(0);
        a.setDrtg(0);
        a.setRebPercentage(0);
        a.setOrbPercentage(0);
        a.setDrbPercentage(0);
        a.setAstPercentage(0);
        a.setStlPercentage(0);
        a.setBlkPercentage(0);
        a.setTovPercentage((FGA + 0.44 * FTA + TOV) != 0 ? 100 * TOV / (FGA + 0.44 * FTA + TOV) : 0);
        a.setFtr(FGA != 0 ? (double) FTA / FGA : 0);

        return a;
    }

    // ───────────────────────────────────────────────
    // Calculate PhysicalBasedMetricsStats from BasicStats and PhysicalRecords
    private PhysicalBasedMetricsStats calculatePhysicalMetrics(BasicStats basicStats) {
        if (basicStats.getPlayer() == null) return null;

        Player player = basicStats.getPlayer();
        PhysicalRecords record = physicalRecordsRepository.findByPlayer(player);
        if (record == null) return null;

        double height = record.getHeight().doubleValue();
        double wingspan = record.getWingspan().doubleValue();
        double vertical = record.getVertical().doubleValue();
        double weight = record.getWeight().doubleValue();

        double api = (vertical + 1 + 1 + wingspan) / 4;
        double ddr = (1 + 1) * (wingspan / height + 1.0) / 2;
        double rpi = (height + 0.5 * wingspan) / weight;
        double mabs = (height + wingspan) / weight;
        double psi = (wingspan / height) + 2.0;

        PhysicalBasedMetricsStats metrics = new PhysicalBasedMetricsStats();
        metrics.setAthleticPerformanceIndex(api);
        metrics.setDefensiveDisruptionRating(ddr);
        metrics.setReboundPotentialIndex(rpi);
        metrics.setMobilityAdjustedBuildScore(mabs);
        metrics.setPositionSuitabilityIndex(psi);

        return metrics;
    }
}

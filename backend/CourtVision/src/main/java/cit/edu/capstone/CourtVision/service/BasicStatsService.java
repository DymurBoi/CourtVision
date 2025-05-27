package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.mapper.BasicStatsMapper;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BasicStatsService {

    @Autowired
    private BasicStatsRepository basicStatsRepository;

    @Autowired
    private AdvancedStatsRepository advancedStatsRepository;

    @Autowired
    private PhysicalBasedMetricsStatsRepository physicalMetricsRepo;

    @Autowired
    private GameRepository gameRepository;

    public List<BasicStats> getAll() {
        return basicStatsRepository.findAll();
    }

    public BasicStats getById(Long id) {
        return basicStatsRepository.findById(id).orElse(null);
    }

    public BasicStats create(BasicStats basicStats) {
        // Save BasicStats first
        BasicStats savedBasic = basicStatsRepository.save(basicStats);
        Game game=new Game();
        game=savedBasic.getGame();
        // Auto-create AdvancedStats
        AdvancedStats advanced = calculateAdvancedStats(savedBasic);
        advanced.setBasicStats(savedBasic);
        advanced.setGame(game);
        advancedStatsRepository.save(advanced);

        // Auto-create PhysicalBasedMetricsStats
        PhysicalBasedMetricsStats metrics = calculatePhysicalMetrics(savedBasic);
        metrics.setBasicStats(savedBasic);
        metrics.setGame(game);
        physicalMetricsRepo.save(metrics);

        return savedBasic;
    }


    public BasicStats update(Long id, BasicStats updatedStats) {
        BasicStats existing = getById(id);
        if (existing != null) {
            updatedStats.setBasicStatId(id);
            BasicStats savedBasic = basicStatsRepository.save(updatedStats);

            // Update AdvancedStats
            AdvancedStats existingAdvanced = advancedStatsRepository.findByBasicStats(savedBasic);
            if (existingAdvanced != null) {
                AdvancedStats updatedAdvanced = calculateAdvancedStats(savedBasic);
                updatedAdvanced.setAdvancedStatsId(existingAdvanced.getAdvancedStatsId());
                updatedAdvanced.setBasicStats(savedBasic);
                advancedStatsRepository.save(updatedAdvanced);
            }

            // Update PhysicalBasedMetricsStats
            PhysicalBasedMetricsStats existingMetrics = physicalMetricsRepo.findByBasicStats(savedBasic);
            if (existingMetrics != null) {
                PhysicalBasedMetricsStats updatedMetrics = calculatePhysicalMetrics(savedBasic);
                updatedMetrics.setPhysicalBasedMetricsStatsId(existingMetrics.getPhysicalBasedMetricsStatsId());
                updatedMetrics.setBasicStats(savedBasic);
                physicalMetricsRepo.save(updatedMetrics);
            }

            return savedBasic;
        }
        return null;
    }

    public void delete(Long id) {
        BasicStats basic = getById(id);
        if (basic != null) {
            AdvancedStats advanced = advancedStatsRepository.findByBasicStats(basic);
            if (advanced != null) {
                advancedStatsRepository.delete(advanced);
            }

            PhysicalBasedMetricsStats metrics = physicalMetricsRepo.findByBasicStats(basic);
            if (metrics != null) {
                physicalMetricsRepo.delete(metrics);
            }

            basicStatsRepository.deleteById(id);
        }
    }

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
        a.setAssistRatio((FGA + 0.44 * FTA + TOV) != 0 ? 100 * AST / (FGA + 0.44 * FTA + TOV) : 0);
        a.setTurnoverRatio((FGA + 0.44 * FTA + AST + TOV) != 0 ? 100 * TOV / (FGA + 0.44 * FTA + AST + TOV) : 0);
        a.setTovPercentage((FGA + 0.44 * FTA + TOV) != 0 ? 100 * TOV / (FGA + 0.44 * FTA + TOV) : 0);
        a.setFtr(FGA != 0 ? (double) FTA / FGA : 0);

        a.setUsg(0);
        a.setPie(0);
        a.setOrtg(0);
        a.setDrtg(0);
        a.setRebPercentage(0);
        a.setOrbPercentage(0);
        a.setDrbPercentage(0);
        a.setAstPercentage(0);
        a.setStlPercentage(0);
        a.setBlkPercentage(0);

        return a;
    }

    private PhysicalBasedMetricsStats calculatePhysicalMetrics(BasicStats b) {
        PhysicalBasedMetricsStats p = new PhysicalBasedMetricsStats();

        // Fill with actual formulas if you connect to PhysicalRecords later
        p.setAthleticPerformanceIndex(0);
        p.setDefensiveDisruptionRating(0);
        p.setReboundPotentialIndex(0);
        p.setMobilityAdjustedBuildScore(0);
        p.setPositionSuitabilityIndex(0);

        return p;
    }

    public List<BasicStatsDTO> getBasicStatsByGameId(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameId(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }
}

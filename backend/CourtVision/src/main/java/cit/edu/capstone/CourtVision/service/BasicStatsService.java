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

    @Autowired
    private PlayerAveragesService playerAveragesService;

    @Autowired
    private PhysicalBasedMetricsStatsService physicalBasedMetricsStatsService;

    public List<BasicStats> getAll() {
        return basicStatsRepository.findAll();
    }

    public BasicStats getById(Long id) {
        return basicStatsRepository.findById(id).orElse(null);
    }

    public BasicStats create(BasicStats basicStats) {
        int points = (basicStats.getTwoPtMade() * 2) + (basicStats.getThreePtMade() * 3) + basicStats.getFtMade();
        basicStats.setGamePoints(points);

        // Save BasicStats first
        BasicStats savedBasic = basicStatsRepository.save(basicStats);
        Game game = savedBasic.getGame();

        // Auto-create AdvancedStats
        AdvancedStats advanced = calculateAdvancedStats(savedBasic);
        advanced.setBasicStats(savedBasic);
        advanced.setGame(game);
        advancedStatsRepository.save(advanced);

        // Auto-create PhysicalBasedMetricsStats using the service (uses PhysicalRecords)
        physicalBasedMetricsStatsService.createFrom(savedBasic);

        // Update player averages
        playerAveragesService.updateAverages(savedBasic.getPlayer().getPlayerId());

        return savedBasic;
    }


    public BasicStats update(Long id, BasicStats updatedStats) {
    BasicStats existing = getById(id);
    if (existing != null) {
        // Preserve existing values for fields that are not included in the update request
        if (updatedStats.getTwoPtAttempts() != 0) {
            existing.setTwoPtAttempts(updatedStats.getTwoPtAttempts());
        }
        if (updatedStats.getTwoPtMade() != 0) {
            existing.setTwoPtMade(updatedStats.getTwoPtMade());
        }
        if (updatedStats.getThreePtAttempts() != 0) {
            existing.setThreePtAttempts(updatedStats.getThreePtAttempts());
        }
        if (updatedStats.getThreePtMade() != 0) {
            existing.setThreePtMade(updatedStats.getThreePtMade());
        }
        if (updatedStats.getFtAttempts() != 0) {
            existing.setFtAttempts(updatedStats.getFtAttempts());
        }
        if (updatedStats.getFtMade() != 0) {
            existing.setFtMade(updatedStats.getFtMade());
        }
        if (updatedStats.getAssists() != 0) {
            existing.setAssists(updatedStats.getAssists());
        }
        if (updatedStats.getoFRebounds() != 0) {
            existing.setoFRebounds(updatedStats.getoFRebounds());
        }
        if (updatedStats.getdFRebounds() != 0) {
            existing.setdFRebounds(updatedStats.getdFRebounds());
        }
        if (updatedStats.getBlocks() != 0) {
            existing.setBlocks(updatedStats.getBlocks());
        }
        if (updatedStats.getSteals() != 0) {
            existing.setSteals(updatedStats.getSteals());
        }
        if (updatedStats.getTurnovers() != 0) {
            existing.setTurnovers(updatedStats.getTurnovers());
        }
        if (updatedStats.getpFouls() != 0) {
            existing.setpFouls(updatedStats.getpFouls());
        }
        if (updatedStats.getdFouls() != 0) {
            existing.setdFouls(updatedStats.getdFouls());
        }
        if (updatedStats.getPlusMinus() != 0) {
            existing.setPlusMinus(updatedStats.getPlusMinus());
        }
        if (updatedStats.getMinutes() != null) {
            existing.setMinutes(updatedStats.getMinutes());
        }
        if (updatedStats.getGamePoints() != 0) {
            existing.setGamePoints(updatedStats.getGamePoints());
        }
        
        // Set the player and game associations if they're provided in the update request
        if (updatedStats.getPlayer() != null) {
            existing.setPlayer(updatedStats.getPlayer());
        }
        if (updatedStats.getGame() != null) {
            existing.setGame(updatedStats.getGame());
        }

        // Save the updated record
        BasicStats savedBasic = basicStatsRepository.save(existing);

        // Update related AdvancedStats and PhysicalBasedMetricsStats if necessary
        AdvancedStats existingAdvanced = advancedStatsRepository.findByBasicStats(savedBasic);
        if (existingAdvanced != null) {
            AdvancedStats updatedAdvanced = calculateAdvancedStats(savedBasic);
            updatedAdvanced.setAdvancedStatsId(existingAdvanced.getAdvancedStatsId());
            updatedAdvanced.setBasicStats(savedBasic);
            advancedStatsRepository.save(updatedAdvanced);
        }

        PhysicalBasedMetricsStats existingMetrics = physicalMetricsRepo.findByBasicStats(savedBasic);
        if (existingMetrics != null) {
            PhysicalBasedMetricsStats updatedMetrics = calculatePhysicalMetrics(savedBasic);
            updatedMetrics.setPhysicalBasedMetricsStatsId(existingMetrics.getPhysicalBasedMetricsStatsId());
            updatedMetrics.setBasicStats(savedBasic);
            updatedMetrics.setGame(savedBasic.getGame());
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

        // Safely parse time to seconds
        long minutesInSeconds = 0;
        if (b.getMinutes() != null) {
            try {
                minutesInSeconds = b.getMinutes().toLocalTime().toSecondOfDay();
            } catch (Exception e) {
                minutesInSeconds = 0;  // fallback if parsing fails
            }
        }

        double twoPtAttempts = b.getTwoPtAttempts();
        double twoPtMade = b.getTwoPtMade();
        double threePtAttempts = b.getThreePtAttempts();
        double ftAttempts = b.getFtAttempts();
        double gamePoints = b.getGamePoints();
        double assists = b.getAssists();
        double oReb = b.getoFRebounds();
        double dReb = b.getdFRebounds();
        double blocks = b.getBlocks();
        double steals = b.getSteals();
        double turnovers = b.getTurnovers();

        double wingspan = 1.0;  // ← replace with real value later
        double height = 1.0;    // ← replace with real value later
        double vertical = 1.0;  // ← replace with real value later

        // Finishing Efficiency
        double finishingEfficiency = (twoPtAttempts > 0)
                ? (twoPtMade / twoPtAttempts) / (0.52 + 0.25 * (vertical / 34.0) + 0.1 * (wingspan / height / 1.06))
                : 0;

        // Rebounding Efficiency
        double reboundingEfficiency = (minutesInSeconds > 0)
                ? ((oReb + dReb) / minutesInSeconds) / (0.008 + 0.02 * (wingspan / height / 1.06) + 0.015 * (vertical / 34.0))
                : 0;

        // Defensive Activity Index
        double defensiveActivityIndex = (blocks + steals) / (1.0 + 0.25 * (wingspan / height / 1.06) + 0.15 * (vertical / 34.0));

        // Physical Efficiency Rating (PER_Lite)
        double tsAttempts = twoPtAttempts + threePtAttempts + 0.44 * ftAttempts;
        double tsPct = (tsAttempts > 0) ? gamePoints / (2.0 * tsAttempts) : 0;

        double FAI = 1.0;  // Finishing Ability Index — can adjust later if you have more metrics
        double physicalEfficiencyRating = (tsPct + 0.45 * assists + 0.35 * (oReb + dReb) +
                0.6 * (steals + blocks) - 0.5 * turnovers) * (0.5 + 0.5 * FAI);

        // Set values
        p.setFinishingEfficiency(finishingEfficiency);
        p.setReboundingEfficiency(reboundingEfficiency);
        p.setDefensiveActivityIndex(defensiveActivityIndex);
        p.setPhysicalEfficiencyRating(physicalEfficiencyRating);

        return p;
    }


    public List<BasicStatsDTO> getBasicStatsByGameId(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameId(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }
}

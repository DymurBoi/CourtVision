package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;
import cit.edu.capstone.CourtVision.repository.AdvancedStatsRepository;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
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
    private PhysicalBasedMetricsStatsService physicalMetricsService;

    public List<BasicStats> getAll() {
        return basicStatsRepository.findAll();
    }

    public BasicStats getById(Long id) {
        return basicStatsRepository.findById(id).orElse(null);
    }

    public BasicStats create(BasicStats basicStats) {
        // Save BasicStats first to get its ID
        BasicStats savedBasic = basicStatsRepository.save(basicStats);

        // Create and save AdvancedStats
        AdvancedStats advanced = calculateAdvancedStats(savedBasic);
        advanced.setBasicStats(savedBasic);
        advancedStatsRepository.save(advanced);

        // Create and save PhysicalBasedMetricsStats
        PhysicalBasedMetricsStats metrics = physicalMetricsService.createFrom(savedBasic);
        // Note: metrics already saved inside createFrom()

        return savedBasic;
    }

    public BasicStats update(Long id, BasicStats updatedStats) {
        BasicStats existing = getById(id);
        if (existing != null) {
            updatedStats.setBasicStatId(id);
            BasicStats savedBasic = basicStatsRepository.save(updatedStats);

            // Update AdvancedStats if present
            AdvancedStats existingAdvanced = advancedStatsRepository.findByBasicStats(savedBasic);
            if (existingAdvanced != null) {
                AdvancedStats updatedAdvanced = calculateAdvancedStats(savedBasic);
                updatedAdvanced.setAdvancedStatsId(existingAdvanced.getAdvancedStatsId());
                updatedAdvanced.setBasicStats(savedBasic);
                advancedStatsRepository.save(updatedAdvanced);
            }

            // Optionally update PhysicalBasedMetricsStats (if needed)
            physicalMetricsService.createFrom(savedBasic);  // re-create or update

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

            physicalMetricsService.deleteByBasicStats(basic); 

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
}

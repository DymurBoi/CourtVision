package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.entity.BasicStats;
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

    public List<BasicStats> getAll() {
        return basicStatsRepository.findAll();
    }

    public BasicStats getById(Long id) {
        return basicStatsRepository.findById(id).orElse(null);
    }

    public BasicStats create(BasicStats basicStats) {
        // Save BasicStats first
        BasicStats savedBasicStats = basicStatsRepository.save(basicStats);

        // Create AdvancedStats with all fields zero, linked to BasicStats
        AdvancedStats advancedStats = new AdvancedStats();
        advancedStats.setuPER(0);
        advancedStats.seteFG(0);
        advancedStats.setTs(0);
        advancedStats.setUsg(0);
        advancedStats.setAssistRatio(0);
        advancedStats.setTurnoverRatio(0);
        advancedStats.setPie(0);
        advancedStats.setOrtg(0);
        advancedStats.setDrtg(0);
        advancedStats.setRebPercentage(0);
        advancedStats.setOrbPercentage(0);
        advancedStats.setDrbPercentage(0);
        advancedStats.setAstPercentage(0);
        advancedStats.setStlPercentage(0);
        advancedStats.setBlkPercentage(0);
        advancedStats.setTovPercentage(0);
        advancedStats.setFtr(0);

        // Link to the saved BasicStats
        advancedStats.setBasicStats(savedBasicStats);

        // Save AdvancedStats
        advancedStatsRepository.save(advancedStats);

        // Update BasicStats to point back to AdvancedStats if needed (optional)
        savedBasicStats.setAdvancedStats(advancedStats);
        return basicStatsRepository.save(savedBasicStats);
    }

    public BasicStats update(Long id, BasicStats updatedStats) {
        return basicStatsRepository.findById(id).map(existing -> {
            existing.setTwoPtAttempts(updatedStats.getTwoPtAttempts());
            existing.setTwoPtMade(updatedStats.getTwoPtMade());
            existing.setThreePtAttempts(updatedStats.getThreePtAttempts());
            existing.setThreePtMade(updatedStats.getThreePtMade());
            existing.setFtAttempts(updatedStats.getFtAttempts());
            existing.setFtMade(updatedStats.getFtMade());
            existing.setAssists(updatedStats.getAssists());
            existing.setoFRebounds(updatedStats.getoFRebounds());
            existing.setdFRebounds(updatedStats.getdFRebounds());
            existing.setBlocks(updatedStats.getBlocks());
            existing.setSteals(updatedStats.getSteals());
            existing.setTurnovers(updatedStats.getTurnovers());
            existing.setpFouls(updatedStats.getpFouls());
            existing.setdFouls(updatedStats.getdFouls());
            existing.setPlusMinus(updatedStats.getPlusMinus());
            existing.setMinutes(updatedStats.getMinutes());
            return basicStatsRepository.save(existing);
        }).orElse(null);
    }

    public void delete(Long id) {
        basicStatsRepository.deleteById(id);
    }
}

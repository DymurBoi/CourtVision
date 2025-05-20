package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BasicStatsService {

    @Autowired
    private BasicStatsRepository basicRepo;

    @Autowired
    private AdvancedStatsService advancedStatsService;

    @Autowired
    private PhysicalBasedMetricsStatsService physicalStatsService;

    @Autowired
    private GameRepository gameRepo;

    //Get all BasicStats
    public List<BasicStats> getAll() {
        return basicRepo.findAll();
    }

    //Get BasicStats by ID
    public BasicStats getById(Long id) {
        return basicRepo.findById(id).orElse(null);
    }

    //Get BasicStats by Game ID
    public BasicStats getByGameId(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? basicRepo.findByGame(game) : null;
    }

    //Create BasicStats + Generate Advanced & Physical Metrics
    public BasicStats save(BasicStats stat) {
        stat.setPlusMinus(calculatePlusMinus(stat));
        BasicStats saved = basicRepo.save(stat);

        advancedStatsService.generateFromBasic(saved);
        physicalStatsService.createFrom(saved);

        return saved;
    }

    //Update BasicStats + Recalculate advanced/physical metrics
    public BasicStats update(Long id, BasicStats updatedStat) {
        BasicStats existing = getById(id);
        if (existing == null) return null;

        updatedStat.setBasicStatId(id);
        updatedStat.setPlusMinus(calculatePlusMinus(updatedStat));
        BasicStats saved = basicRepo.save(updatedStat);

        advancedStatsService.updateFromBasic(saved);
        physicalStatsService.createFrom(saved); // Overwrite existing derived stats

        return saved;
    }

    //Delete BasicStats + Related derived stats
    public void delete(Long id) {
        BasicStats existing = basicRepo.findById(id).orElse(null);
        if (existing != null) {
            Game game = existing.getGame();

            advancedStatsService.deleteByGame(game);
            physicalStatsService.deleteByGame(game);

            basicRepo.deleteById(id);
        }
    }

    //Utility: Plus-Minus formula
    private int calculatePlusMinus(BasicStats stat) {
        int score = (stat.getTwoPtMade() * 2) + (stat.getThreePtMade() * 3) + stat.getFtMade();
        int impact = stat.getAssists() + stat.getBlocks() + stat.getSteals()
                + stat.getoFRebounds() + stat.getdFRebounds();
        int penalties = stat.getTurnovers() + stat.getpFouls() + stat.getdFouls();

        return score + impact - penalties;
    }
}
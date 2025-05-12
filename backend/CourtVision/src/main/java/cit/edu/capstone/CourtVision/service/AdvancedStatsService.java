package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.repository.AdvancedStatsRepository;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvancedStatsService {

    @Autowired
    private AdvancedStatsRepository advancedRepo;

    @Autowired
    private AdvancedStatCalculator calculator;

    @Autowired
    private GameRepository gameRepo;

    public List<AdvancedStats> getAll() {
        return advancedRepo.findAll();
    }

    public AdvancedStats getByGameId(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? advancedRepo.findByGame(game) : null;
    }

    public void generateFromBasic(BasicStats basicStats) {
        AdvancedStats stats = calculator.computeAdvancedStats(basicStats);
        stats.setGame(basicStats.getGame());
        advancedRepo.save(stats);
    }

    public void updateFromBasic(BasicStats basicStats) {
        AdvancedStats existing = advancedRepo.findByGame(basicStats.getGame());
        if (existing != null) {
            AdvancedStats updated = calculator.computeAdvancedStats(basicStats);
            updated.setId(existing.getId());
            updated.setGame(basicStats.getGame());
            advancedRepo.save(updated);
        } else {
            generateFromBasic(basicStats);
        }
    }

    public void deleteByGame(Game game) {
        AdvancedStats stats = advancedRepo.findByGame(game);
        if (stats != null) {
            advancedRepo.delete(stats);
        }
    }
}
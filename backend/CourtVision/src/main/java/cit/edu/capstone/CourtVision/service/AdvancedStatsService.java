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
    private GameRepository gameRepo;

    public List<AdvancedStats> getAll() {
        return advancedRepo.findAll();
    }

    public AdvancedStats getByGameId(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? advancedRepo.findByGame(game) : null;
    }

    public void generateFromBasic(BasicStats basic) {
        AdvancedStats stats = computeAdvancedStats(basic);
        stats.setGame(basic.getGame());
        advancedRepo.save(stats);
    }

    public void updateFromBasic(BasicStats basic) {
        AdvancedStats existing = advancedRepo.findByGame(basic.getGame());
        AdvancedStats updated = computeAdvancedStats(basic);
        if (existing != null) {
            updated.setId(existing.getId());
        }
        updated.setGame(basic.getGame());
        advancedRepo.save(updated);
    }

    public void deleteByGame(Game game) {
        AdvancedStats stats = advancedRepo.findByGame(game);
        if (stats != null) {
            advancedRepo.delete(stats);
        }
    }

    // 🔢 Inline calculator logic here
    private AdvancedStats computeAdvancedStats(BasicStats basic) {
        double minutes = basic.getMinutes().toLocalTime().toSecondOfDay() / 60.0;
        double FGA = basic.getTwoPtAttempts() + basic.getThreePtAttempts();
        double FGM = basic.getTwoPtMade() + basic.getThreePtMade();
        double FTM = basic.getFtMade();
        double FTA = basic.getFtAttempts();
        double AST = basic.getAssists();
        double TOV = basic.getTurnovers();
        double ORB = basic.getoFRebounds();
        double DRB = basic.getdFRebounds();
        double STL = basic.getSteals();
        double BLK = basic.getBlocks();
        double PF = basic.getpFouls();
        double Points = (basic.getTwoPtMade() * 2) + (basic.getThreePtMade() * 3) + FTM;

        return AdvancedStats.builder()
                .uPER(minutes > 0 ? (FGM + 0.5 * basic.getThreePtMade() - FGA + 0.5 * FTM - FTA + ORB + 0.5 * DRB + AST + STL + 0.5 * BLK - PF - TOV) / minutes : 0.0)
                .eFG(FGA > 0 ? (FGM + 0.5 * basic.getThreePtMade()) / FGA : 0.0)
                .ts((FGA + 0.44 * FTA) > 0 ? Points / (2 * (FGA + 0.44 * FTA)) : 0.0)
                .usg(minutes > 0 ? 100 * (FGA + 0.44 * FTA + TOV) / minutes : 0.0)
                .assistRatio((FGA + 0.44 * FTA + TOV) > 0 ? 100 * AST / (FGA + 0.44 * FTA + TOV) : 0.0)
                .turnoverRatio((FGA + 0.44 * FTA + AST + TOV) > 0 ? 100 * TOV / (FGA + 0.44 * FTA + AST + TOV) : 0.0)
                .pie((Points + ORB + DRB + AST + STL + BLK - (FGA - FGM) - TOV - PF) / 100.0)
                .ortg((FGA + 0.44 * FTA + TOV) > 0 ? 100 * Points / (FGA + 0.44 * FTA + TOV) : 0.0)
                .drtg((Points > 0 && minutes > 0) ? 100 * Points / minutes : 0.0)
                .rebPercentage(minutes > 0 ? 100 * (ORB + DRB) / minutes : 0.0)
                .orbPercentage(minutes > 0 ? 100 * ORB / minutes : 0.0)
                .drbPercentage(minutes > 0 ? 100 * DRB / minutes : 0.0)
                .astPercentage(minutes > 0 ? 100 * AST / minutes : 0.0)
                .stlPercentage(minutes > 0 ? 100 * STL / minutes : 0.0)
                .blkPercentage(minutes > 0 ? 100 * BLK / minutes : 0.0)
                .tovPercentage((FGA + 0.44 * FTA + TOV) > 0 ? 100 * TOV / (FGA + 0.44 * FTA + TOV) : 0.0)
                .ftr(FGA > 0 ? FTA / FGA : 0.0)
                .build();
    }

}
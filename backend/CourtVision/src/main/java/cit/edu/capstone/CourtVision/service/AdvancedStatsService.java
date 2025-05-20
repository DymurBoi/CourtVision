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

    //Get all
    public List<AdvancedStats> getAll() {
        return advancedRepo.findAll();
    }

    //Get by Game ID
    public AdvancedStats getByGameId(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? advancedRepo.findByGame(game) : null;
    }

    //Generate from BasicStats (create)
    public void generateFromBasic(BasicStats basic) {
        if (basic == null || basic.getGame() == null) return;

        AdvancedStats stats = computeAdvancedStats(basic);
        stats.setGame(basic.getGame());
        stats.setBasicStats(basic);

        advancedRepo.save(stats);
    }

    //Update from BasicStats
    public void updateFromBasic(BasicStats basic) {
        if (basic == null || basic.getGame() == null) return;

        AdvancedStats existing = advancedRepo.findByGame(basic.getGame());
        AdvancedStats updated = computeAdvancedStats(basic);

        updated.setGame(basic.getGame());
        updated.setBasicStats(basic);

        if (existing != null) {
            updated.setId(existing.getId());
        }

        advancedRepo.save(updated);
    }

    //Delete by Game
    public void deleteByGame(Game game) {
        AdvancedStats stats = advancedRepo.findByGame(game);
        if (stats != null) {
            advancedRepo.delete(stats);
        }
    }

    //Calculation logic
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

        AdvancedStats stats = new AdvancedStats();

        stats.setuPER(minutes > 0 ?
                (FGM + 0.5 * basic.getThreePtMade() - FGA + 0.5 * FTM - FTA + ORB + 0.5 * DRB + AST + STL + 0.5 * BLK - PF - TOV) / minutes : 0.0);

        stats.seteFG(FGA > 0 ? (FGM + 0.5 * basic.getThreePtMade()) / FGA : 0.0);
        stats.setTs((FGA + 0.44 * FTA) > 0 ? Points / (2 * (FGA + 0.44 * FTA)) : 0.0);
        stats.setUsg(minutes > 0 ? 100 * (FGA + 0.44 * FTA + TOV) / minutes : 0.0);
        stats.setAssistRatio((FGA + 0.44 * FTA + TOV) > 0 ? 100 * AST / (FGA + 0.44 * FTA + TOV) : 0.0);
        stats.setTurnoverRatio((FGA + 0.44 * FTA + AST + TOV) > 0 ? 100 * TOV / (FGA + 0.44 * FTA + AST + TOV) : 0.0);
        stats.setPie((Points + ORB + DRB + AST + STL + BLK - (FGA - FGM) - TOV - PF) / 100.0);
        stats.setOrtg((FGA + 0.44 * FTA + TOV) > 0 ? 100 * Points / (FGA + 0.44 * FTA + TOV) : 0.0);
        stats.setDrtg((Points > 0 && minutes > 0) ? 100 * Points / minutes : 0.0);
        stats.setRebPercentage(minutes > 0 ? 100 * (ORB + DRB) / minutes : 0.0);
        stats.setOrbPercentage(minutes > 0 ? 100 * ORB / minutes : 0.0);
        stats.setDrbPercentage(minutes > 0 ? 100 * DRB / minutes : 0.0);
        stats.setAstPercentage(minutes > 0 ? 100 * AST / minutes : 0.0);
        stats.setStlPercentage(minutes > 0 ? 100 * STL / minutes : 0.0);
        stats.setBlkPercentage(minutes > 0 ? 100 * BLK / minutes : 0.0);
        stats.setTovPercentage((FGA + 0.44 * FTA + TOV) > 0 ? 100 * TOV / (FGA + 0.44 * FTA + TOV) : 0.0);
        stats.setFtr(FGA > 0 ? FTA / FGA : 0.0);

        return stats;
    }
}
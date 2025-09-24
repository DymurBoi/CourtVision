package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private TeamRepository teamRepo;

    //Get all games
    public List<Game> getAll() {
        return gameRepo.findAll();
    }

    //Get game by ID
    public Game getById(Long id) {
        return gameRepo.findById(id).orElse(null);
    }

    //Get all games by team ID
    public List<Game> getByTeamId(Long teamId) {
        Team team = teamRepo.findById(teamId).orElse(null);
        return team != null ? gameRepo.findByTeam(team) : null;
    }

    //Create a new game
    public Game save(Game game) {
        return gameRepo.save(game);
    }

    //Update existing game (partial update style)
    public Game update(Long id, Game updatedGame) {
        Game existingGame = getById(id);
        if (existingGame != null) {
            if (updatedGame.getGameName() != null) {
                existingGame.setGameName(updatedGame.getGameName());
            }
            if (updatedGame.getGameType() != null) {
                existingGame.setGameType(updatedGame.getGameType());
            }
            if (updatedGame.getRecordingType() != null) {
                existingGame.setRecordingType(updatedGame.getRecordingType());
            }
            if (updatedGame.getGameDate() != null) {
                existingGame.setGameDate(updatedGame.getGameDate());
            }
            if (updatedGame.getGameResult() != null) {
                existingGame.setGameResult(updatedGame.getGameResult());
            }
            if (updatedGame.getFinalScore() != null) {
                existingGame.setFinalScore(updatedGame.getFinalScore());
            }
            if (updatedGame.getComments() != null) {
                existingGame.setComments(updatedGame.getComments());
            }
            if (updatedGame.getComments() != null) {
                existingGame.setComments(updatedGame.getComments());
            }
            if (updatedGame.getTeam() != null) {
                existingGame.setTeam(updatedGame.getTeam());
            }
            if (updatedGame.getBasicStats() != null) {
                existingGame.setBasicStats(updatedGame.getBasicStats());
            }
            if (updatedGame.getAdvancedStats() != null) {
                existingGame.setAdvancedStats(updatedGame.getAdvancedStats());
            }
            if (updatedGame.getPhysicalBasedMetricsStats() != null) {
                existingGame.setPhysicalBasedMetricsStats(updatedGame.getPhysicalBasedMetricsStats());
            }

            return gameRepo.save(existingGame);
        }
        return null;
    }

    //Delete game by ID
    public void delete(Long id) {
        gameRepo.deleteById(id);
    }
}
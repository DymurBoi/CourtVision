package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.BasicStatsVariationRepository;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import cit.edu.capstone.CourtVision.repository.SeasonRepository;
import cit.edu.capstone.CourtVision.entity.Season;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import cit.edu.capstone.CourtVision.entity.BasicStatsVariation;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private TeamRepository teamRepo;

    @Autowired
    private BasicStatsVariationRepository basicStats;
    @Autowired
    private SeasonRepository seasonRepository;
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
            // Assign a season to the game: prefer explicit season in request, otherwise pick an active season
            if (game.getSeason() != null && game.getSeason().getId() != null) {
                Long sid = game.getSeason().getId();
                Season season = seasonRepository.findById(sid).orElseThrow(() -> new RuntimeException("Season not found"));
                if (!season.isActive()) {
                    throw new RuntimeException("Cannot add game to an inactive season");
                }
                // Allow any team to create games inside an active season.
                game.setSeason(season);
            } else {
                // If no season was provided, pick any globally active season.
                var activeSeasons = seasonRepository.findByActiveTrue();
                if (activeSeasons == null || activeSeasons.isEmpty()) {
                    throw new RuntimeException("No active season found. Start a season before creating games.");
                }
                game.setSeason(activeSeasons.get(0));
            }

            Game savedGame = gameRepo.save(game);

        if ("Live".equalsIgnoreCase(savedGame.getRecordingType())) {
            BasicStatsVariation stats = new BasicStatsVariation();
            stats = setStats(stats, savedGame);
            basicStats.save(stats);
        }

        return savedGame;
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

    public BasicStatsVariation setStats(BasicStatsVariation stats, Game game){
        stats.setTwoPtAttempts(0);
        stats.setTwoPtMade(0);
        stats.setThreePtAttempts(0);
        stats.setThreePtMade(0);
        stats.setFtAttempts(0);
        stats.setFtMade(0);
        stats.setAssists(0);
        stats.setoFRebounds(0);
        stats.setdFRebounds(0);
        stats.setBlocks(0);
        stats.setSteals(0);
        stats.setTurnovers(0);
        stats.setpFouls(0);
        stats.setdFouls(0);
        stats.setPlusMinus(0);
        stats.setGamePoints(0);
        stats.setGame(game);
        return stats;
    }

    public String updateRecordingType(Long gameId, String type) {
        Game game = gameRepo.findById(gameId).orElse(null);
        if (game == null) return null;
        game.setRecordingType(type);
        gameRepo.save(game);
        return type;
    }

    public String updateFinalScore(Long gameId, String score) {
        Game game = gameRepo.findById(gameId).orElse(null);
        if (game == null) return null;
        String[] scores = score.split("-");
        if (scores.length == 2) {
            int teamScore = Integer.parseInt(scores[0].trim());
                int opponentScore = Integer.parseInt(scores[1].trim());

                // Set the game result based on the score comparison
                if (teamScore > opponentScore) {
                    game.setGameResult("W");  // Win
                } else if (teamScore < opponentScore) {
                    game.setGameResult("L");  // Loss
                }
        }
        game.setFinalScore(score);
        gameRepo.save(game);
        return score;
    }
}
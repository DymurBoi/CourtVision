package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.entity.Season;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import cit.edu.capstone.CourtVision.repository.SeasonRepository;
import org.springframework.stereotype.Service;
import cit.edu.capstone.CourtVision.dto.PlayerSeasonAveragesDTO;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class SeasonService {


    private final SeasonRepository seasonRepository;
    private final BasicStatsRepository basicStatsRepository;
    private final GameRepository gameRepository;
    private final TeamRepository teamRepository;

    public SeasonService(
            SeasonRepository seasonRepository,
            BasicStatsRepository basicStatsRepository,
            TeamRepository teamRepository,
            GameRepository gameRepository
    ) {
        this.seasonRepository = seasonRepository;
        this.basicStatsRepository = basicStatsRepository;
        this.teamRepository = teamRepository;
        this.gameRepository = gameRepository;
    }

    public Season startSeason(String name, Long teamId) {
        List<Season> activeSeasons=seasonRepository.findByActiveTrueAndTeam_TeamId(teamId);
        if (!activeSeasons.isEmpty()) {
            return null;
        }
        // fetch team and set
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));

        Season season = new Season();
        season.setSeasonName(name);
        season.setStartDate(LocalDate.now());
        season.setActive(true);
        season.setTeam(team);

        return seasonRepository.save(season);
    }
    public Season stopSeason(Long seasonId) {
        Season season = seasonRepository.findById(seasonId).orElseThrow();
        season.setEndDate(LocalDate.now());
        season.setActive(false);
        return seasonRepository.save(season);
    }

    public List<Season> getSeasonsByTeam(Long teamId) {
        return seasonRepository.findByTeam_TeamId(teamId);
    }

    public List<Season> getActiveSeasons() {
        return seasonRepository.findByActiveTrue();
    }

    public PlayerSeasonAveragesDTO calculatePlayerSeasonAverages(Long playerId, Long seasonId) {
        // Prefer Game -> Season lookup (some BasicStats records may not have season set directly)
        List<BasicStats> statsList = basicStatsRepository.findByPlayer_PlayerIdAndGame_Season_Id(playerId, seasonId);
        if (statsList == null || statsList.isEmpty()) {
            statsList = basicStatsRepository.findByPlayer_PlayerIdAndSeason_Id(playerId, seasonId);
        }

        // Prefer Game -> Season -> Team lookup to ensure stats are from this season's team
        Season season = seasonRepository.findById(seasonId).orElseThrow(() -> new RuntimeException("Season not found"));
        Long teamId = season.getTeam() != null ? season.getTeam().getTeamId() : null;
        if (teamId != null) {
            List<BasicStats> teamStatsList = basicStatsRepository.findByPlayer_PlayerIdAndGame_Season_IdAndGame_Team_TeamId(playerId, seasonId, teamId);
            if (teamStatsList != null && !teamStatsList.isEmpty()) {
                statsList = teamStatsList;
            }
        }
        if (statsList == null || statsList.isEmpty()) {
            // Fallbacks
            statsList = basicStatsRepository.findByPlayer_PlayerIdAndGame_Season_Id(playerId, seasonId);
        }
        if (statsList == null || statsList.isEmpty()) {
            statsList = basicStatsRepository.findByPlayer_PlayerIdAndSeason_Id(playerId, seasonId);
        }

        if (statsList.isEmpty()) {
            return new PlayerSeasonAveragesDTO(playerId, seasonId, 0, 0, 0, 0, 0, 0,0);
        }

        double totalPoints = 0, totalRebounds = 0, totalAssists = 0, totalSteals = 0, totalBlocks = 0, totalTurnovers = 0;

        for (BasicStats stats : statsList) {
            totalPoints += stats.getGamePoints();
            totalRebounds += stats.getoFRebounds()+ stats.getdFRebounds();
            totalAssists += stats.getAssists();
            totalSteals += stats.getSteals();
            totalBlocks += stats.getBlocks();
            totalTurnovers += stats.getTurnovers();
        }

        int gamesPlayed = statsList.size();

        return new PlayerSeasonAveragesDTO(
                playerId,
                seasonId,
                totalPoints / gamesPlayed,
                totalRebounds / gamesPlayed,
                totalAssists / gamesPlayed,
                totalSteals / gamesPlayed,
                totalBlocks / gamesPlayed,
                totalTurnovers / gamesPlayed,
                gamesPlayed
        );
    }

    public List<Season> getAllSeasons() {
        return seasonRepository.findAll();
    }

    public Season getSeasonById(Long seasonId) {
        return seasonRepository.findById(seasonId).orElseThrow(() -> new RuntimeException("Season not found"));
    }

    public List<Game> getGamesBySeason(Long seasonId) {
        // Fetch all games for the given season (including all game types)
        return gameRepository.findBySeason_Id(seasonId);
    }

}

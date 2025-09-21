package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Season;
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

    public SeasonService(SeasonRepository seasonRepository, BasicStatsRepository basicStatsRepository) {
        this.seasonRepository = seasonRepository;
        this.basicStatsRepository = basicStatsRepository;
    }

    public Season startSeason(String name, Long coachId) {
        Season season = new Season();
        season.setSeasonName(name);
        season.setStartDate(LocalDate.now());
        season.setActive(true);
        // set coach manually in controller with CoachService
        return seasonRepository.save(season);
    }

    public Season stopSeason(Long seasonId) {
        Season season = seasonRepository.findById(seasonId).orElseThrow();
        season.setEndDate(LocalDate.now());
        season.setActive(false);
        return seasonRepository.save(season);
    }

    public List<Season> getSeasonsByCoach(Long coachId) {
        return seasonRepository.findByCoachId(coachId);
    }

    public List<Season> getActiveSeasons() {
        return seasonRepository.findByActiveTrue();
    }

    public PlayerSeasonAveragesDTO calculatePlayerSeasonAverages(Long playerId, Long seasonId) {
        List<BasicStats> statsList = basicStatsRepository.findByPlayerIdAndSeasonId(playerId, seasonId);

        if (statsList.isEmpty()) {
            return new PlayerSeasonAveragesDTO(playerId, seasonId, 0, 0, 0, 0, 0, 0);
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
                totalTurnovers / gamesPlayed
        );
    }
}


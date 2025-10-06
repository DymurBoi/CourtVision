package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.mapper.BasicStatsMapper;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BasicStatsService {

    @Autowired
    private BasicStatsRepository basicStatsRepository;

    @Autowired
    private AdvancedStatsRepository advancedStatsRepository;

    @Autowired
    private PhysicalBasedMetricsStatsRepository physicalMetricsRepo;

    @Autowired
    private PlayerAveragesService playerAveragesService;

    @Autowired
    private PhysicalBasedMetricsStatsService physicalBasedMetricsStatsService;
    
    @Autowired
    private PhysicalRecordService physicalRecordService;

    public List<BasicStats> getAll() {
        return basicStatsRepository.findAll();
    }

    public BasicStats getById(Long id) {
        return basicStatsRepository.findById(id).orElse(null);
    }

    public BasicStats pointsConvert(BasicStats basicStats){
        int points = (basicStats.getTwoPtMade() * 2) + (basicStats.getThreePtMade() * 3) + basicStats.getFtMade();
        basicStats.setGamePoints(points);
        return basicStats;
    }
    public BasicStats create(BasicStats basicStats) {
        basicStats=pointsConvert(basicStats);

        // Save BasicStats first
        BasicStats savedBasic = basicStatsRepository.save(basicStats);
        Game game = savedBasic.getGame();

        // Auto-create AdvancedStats
        AdvancedStats advanced = calculateAdvancedStats(savedBasic);
        advanced.setBasicStats(savedBasic);
        advanced.setGame(game);
        advancedStatsRepository.save(advanced);

        // Auto-create PhysicalBasedMetricsStats
        PhysicalBasedMetricsStats metrics = calculatePhysicalMetrics(savedBasic);
        metrics.setBasicStats(savedBasic);
        metrics.setGame(game);
        physicalMetricsRepo.save(metrics);

        // Update player averages
        playerAveragesService.updateAverages(savedBasic.getPlayer().getPlayerId());

        return savedBasic;
    }

    public BasicStats differenceChecker(BasicStats temp, BasicStats updateStat){
        temp.setTwoPtMade(updateStat.getTwoPtMade()-temp.getTwoPtMade());
        System.out.println("Two: "+temp.getTwoPtMade());
        temp.setThreePtMade(updateStat.getThreePtMade()-temp.getThreePtMade());
        System.out.println("Three: "+temp.getThreePtMade());
        temp.setFtMade(updateStat.getFtMade()-temp.getFtMade());
        System.out.println("FT: "+temp.getFtMade());
        System.out.println("GamePts: "+temp.getGamePoints());
        temp=pointsConvert(temp);
        return temp;
    }

    public BasicStats update(Long id, BasicStats updatedStats) {
        BasicStats existing = getById(id);  // Get the current stats from the database
        if (existing != null) {
            // Create a temporary copy of the existing stats to calculate the difference
            BasicStats tempStat = new BasicStats(existing);

            // Update the fields with the new values
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
            existing.setGamePoints(updatedStats.getGamePoints());

            // Update the player and game if present
            if (updatedStats.getPlayer() != null) {
                existing.setPlayer(updatedStats.getPlayer());
            }
            if (updatedStats.getGame() != null) {
                existing.setGame(updatedStats.getGame());
            }

            // Calculate the difference between the existing and updated stats for point values
            tempStat = differenceChecker(tempStat, updatedStats);

            // Update the gamePoints after the difference
            existing.setGamePoints(tempStat.getGamePoints());

            // If the player was subbed in, update the PlusMinus for subbed-in players

                updateSubbedInPlusMinus(existing, tempStat.getGamePoints());
            

            // Save the updated BasicStats back to the repository
            BasicStats savedBasic = basicStatsRepository.save(existing);

            // Recalculate and update AdvancedStats
            Game game = savedBasic.getGame();
            AdvancedStats updatedAdvanced = calculateAdvancedStats(savedBasic);
            AdvancedStats existingAdvanced = advancedStatsRepository.findByBasicStats(savedBasic);
            if (existingAdvanced != null) {
                updatedAdvanced.setAdvancedStatsId(existingAdvanced.getAdvancedStatsId());
            }
            updatedAdvanced.setBasicStats(savedBasic);
            updatedAdvanced.setGame(game);
            advancedStatsRepository.save(updatedAdvanced);

            // Recalculate and update PhysicalBasedMetricsStats
            PhysicalBasedMetricsStats updatedMetrics = physicalBasedMetricsStatsService.createFrom(savedBasic);
            PhysicalBasedMetricsStats existingMetrics = physicalMetricsRepo.findByBasicStats(savedBasic);
            if (existingMetrics != null && updatedMetrics != null) {
                updatedMetrics.setPhysicalBasedMetricsStatsId(existingMetrics.getPhysicalBasedMetricsStatsId());
                updatedMetrics.setBasicStats(savedBasic);
                updatedMetrics.setGame(game);
                physicalMetricsRepo.save(updatedMetrics);
            }

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

            PhysicalBasedMetricsStats metrics = physicalMetricsRepo.findByBasicStats(basic);
            if (metrics != null) {
                physicalMetricsRepo.delete(metrics);
            }

            basicStatsRepository.deleteById(id);
        }
    }

    private AdvancedStats calculateAdvancedStats(BasicStats b) {
        double minutes = b.getMinutes().toLocalTime().toSecondOfDay() / 60.0;
        if (minutes == 0) minutes = 1;  // Avoid divide by zero

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

        // uPER
        a.setuPER(roundToTwoDecimalPlaces((FGM + 0.5 * TPM - FGA + 0.5 * FTM - FTA + ORB + 0.5 * DRB + AST + STL + 0.5 * BLK - PF - TOV) / minutes));

        // Effective Field Goal %
        a.seteFG(roundToTwoDecimalPlaces(FGA != 0 ? (FGM + 0.5 * TPM) / (double) FGA : 0));

        // True Shooting %
        a.setTs(roundToTwoDecimalPlaces((FGA + 0.44 * FTA) != 0 ? PTS / (2.0 * (FGA + 0.44 * FTA)) : 0));

        // Assist Ratio
        a.setAssistRatio(roundToTwoDecimalPlaces((FGA + 0.44 * FTA + TOV) != 0 ? 100 * AST / (FGA + 0.44 * FTA + TOV) : 0));

        // Turnover Ratio
        a.setTurnoverRatio(roundToTwoDecimalPlaces((FGA + 0.44 * FTA + AST + TOV) != 0 ? 100 * TOV / (FGA + 0.44 * FTA + AST + TOV) : 0));

        // Free Throw Rate
        a.setFtr(roundToTwoDecimalPlaces(FGA != 0 ? (double) FTA / FGA : 0));

        // Assist-to-Turnover Ratio (A/T)
        a.setAtRatio(roundToTwoDecimalPlaces(TOV != 0 ? (double) AST / TOV : 0));

        // Free Throw Percentage (FT%)
        a.setFtPercentage(roundToTwoDecimalPlaces(FTA != 0 ? (double) FTM / FTA * 100 : 0));

        // Offensive Rating (ORtg) — simplified
        a.setOrtg(roundToTwoDecimalPlaces(minutes != 0 ? (double) PTS / minutes * 100 : 0));

        // Usage Rate (USG%) — simplified, assuming team possessions ~100 for now
        double teamPossessions = 100;
        a.setUsgPercentage(roundToTwoDecimalPlaces((minutes * teamPossessions) != 0
                ? (double) (b.getTwoPtAttempts() + 0.44 * b.getFtAttempts() + b.getTurnovers()) / (minutes * teamPossessions) * 100
                : 0));

        // Points Per Minute (PPM)
        double totalMinutes = minutes;  // already in minutes
        a.setPointsPerMinute(roundToTwoDecimalPlaces(totalMinutes != 0 ? (double) PTS / totalMinutes : 0));

        // Shooting Efficiency
        int totalMade = b.getTwoPtMade() + b.getThreePtMade() + b.getFtMade();
        int totalAttempts = b.getTwoPtAttempts() + b.getThreePtAttempts() + b.getFtAttempts();
        a.setShootingEfficiency(roundToTwoDecimalPlaces(totalAttempts != 0 ? (double) totalMade / totalAttempts : 0));

        // Points Per Shot
        int fgAttempts = b.getTwoPtAttempts() + b.getThreePtAttempts();
        a.setPointsPerShot(roundToTwoDecimalPlaces(fgAttempts != 0 ? (double) PTS / fgAttempts : 0));

        return a;
    }

    private PhysicalBasedMetricsStats calculatePhysicalMetrics(BasicStats b) {
        PhysicalBasedMetricsStats p = new PhysicalBasedMetricsStats();
        // Safely parse time to seconds
        long minutesInSeconds = 0;
        if (b.getMinutes() != null) {
            try {
                minutesInSeconds = b.getMinutes().toLocalTime().toSecondOfDay();
            } catch (Exception e) {
                minutesInSeconds = 0;  // fallback if parsing fails
            }
        }

        double twoPtAttempts = b.getTwoPtAttempts();
        double twoPtMade = b.getTwoPtMade();
        double threePtAttempts = b.getThreePtAttempts();
        double ftAttempts = b.getFtAttempts();
        double gamePoints = b.getGamePoints();
        double assists = b.getAssists();
        double oReb = b.getoFRebounds();
        double dReb = b.getdFRebounds();
        double blocks = b.getBlocks();
        double steals = b.getSteals();
        double turnovers = b.getTurnovers();

        PhysicalRecords temp=new PhysicalRecords();
        Player tempPlayer=new Player();
        tempPlayer=b.getPlayer();
        temp= physicalRecordService.getByPlayerId(tempPlayer.getPlayerId());
        double wingspan =  temp.getWingspan(); // ← replace with real value later
        double height = temp.getHeight();    // ← replace with real value later
        double vertical = temp.getVertical();  // ← replace with real value later

        // Finishing Efficiency
        double finishingEfficiency = (twoPtAttempts > 0)
                ? roundToTwoDecimalPlaces((twoPtMade / twoPtAttempts) / (0.52 + 0.25 * (vertical / 34.0) + 0.1 * (wingspan / height / 1.06)))
                : 0;

        // Rebounding Efficiency
        double reboundingEfficiency = (minutesInSeconds > 0)
                ? (roundToTwoDecimalPlaces((oReb + dReb) / minutesInSeconds) / (0.008 + 0.02 * (wingspan / height / 1.06) + 0.015 * (vertical / 34.0)))
                : 0;

        // Defensive Activity Index
        double defensiveActivityIndex = roundToTwoDecimalPlaces((blocks + steals) / (1.0 + 0.25 * (wingspan / height / 1.06) + 0.15 * (vertical / 34.0)));

        // Physical Efficiency Rating (PER_Lite)
        double tsAttempts = twoPtAttempts + threePtAttempts + 0.44 * ftAttempts;
        double tsPct = (tsAttempts > 0) ? gamePoints / (2.0 * tsAttempts) : 0;

         // Finishing Ability Index — can adjust later if you have more metrics
        double physicalEfficiencyRating = roundToTwoDecimalPlaces((tsPct + 0.45 * assists + 0.35 * (oReb + dReb) +
                0.6 * (steals + blocks) - 0.5 * turnovers) * (0.5 + 0.5 * finishingEfficiency));

        // Set values
        p.setFinishingEfficiency(finishingEfficiency);
        p.setReboundingEfficiency(reboundingEfficiency);
        p.setDefensiveActivityIndex(defensiveActivityIndex);
        p.setPhysicalEfficiencyRating(physicalEfficiencyRating);

        return p;
    }

    private double roundToTwoDecimalPlaces(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
    public List<BasicStatsDTO> getBasicStatsByGameId(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameId(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }
    public List<BasicStatsDTO> getSubbedInStats(Long gameId) {
    List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndSubbedInTrue(gameId);
    return stats.stream()
                .map(BasicStatsMapper::toDTO)
                .collect(Collectors.toList());
}

public List<BasicStatsDTO> getSubbedOutStats(Long gameId) {
    List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndSubbedInFalse(gameId);
    return stats.stream()
                .map(BasicStatsMapper::toDTO)
                .collect(Collectors.toList());
}

    public List<BasicStats> createBatch(List<BasicStats> statsList) {
    return statsList.stream()
        .filter(stat -> basicStatsRepository.findByGame_GameIdAndPlayer_PlayerId(
            stat.getGame().getGameId(), stat.getPlayer().getPlayerId()
        ).isEmpty())
        .map(this::create)
        .collect(Collectors.toList());
}

    private void updateSubbedInPlusMinus(BasicStats sourcePlayer, int pointDelta) {
        if (pointDelta == 0) return;

        List<BasicStats> subbedInPlayers = basicStatsRepository
                .findByGame_GameIdAndSubbedInTrue(sourcePlayer.getGame().getGameId());

        for (BasicStats stats : subbedInPlayers) {
            int updatedPlusMinus = stats.getPlusMinus() + pointDelta;
            stats.setPlusMinus(updatedPlusMinus);

            System.out.println("Updated PlusMinus for Player " + stats.getPlayer().getPlayerId()
                    + ": " + updatedPlusMinus);
        }

        basicStatsRepository.saveAll(subbedInPlayers);
    }

     public List<BasicStatsDTO> getByGameAndTeam(Long gameId, Long teamId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndPlayer_Team_TeamId(gameId, teamId);

        return stats.stream()
                .map(BasicStatsMapper::toDTO)
                .collect(Collectors.toList());
    }

}

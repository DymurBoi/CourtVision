package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.mapper.BasicStatsMapper;
import cit.edu.capstone.CourtVision.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
public class BasicStatsService {

    @Autowired
    private PlayByPlayRepository playByPlayRepository;
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
            logStatChange(existing, "Two-Pointer Attempts", existing.getTwoPtAttempts(), updatedStats.getTwoPtAttempts());
            existing.setTwoPtAttempts(updatedStats.getTwoPtAttempts());

            logStatChange(existing, "Two-Pointer Made", existing.getTwoPtMade(), updatedStats.getTwoPtMade());
            existing.setTwoPtMade(updatedStats.getTwoPtMade());

            logStatChange(existing, "Three-Pointer Attempts", existing.getThreePtAttempts(), updatedStats.getThreePtAttempts());
            existing.setThreePtAttempts(updatedStats.getThreePtAttempts());

            logStatChange(existing, "Three-Pointer Made", existing.getThreePtMade(), updatedStats.getThreePtMade());
            existing.setThreePtMade(updatedStats.getThreePtMade());

            logStatChange(existing, "Free Throw Attempts", existing.getFtAttempts(), updatedStats.getFtAttempts());
            existing.setFtAttempts(updatedStats.getFtAttempts());

            logStatChange(existing, "Free Throws Made", existing.getFtMade(), updatedStats.getFtMade());
            existing.setFtMade(updatedStats.getFtMade());
            //Assist update
            existing.setAssists(updatedStats.getAssists());
        
            logStatChange(existing, "Offensive Rebounds", existing.getoFRebounds(), updatedStats.getoFRebounds());
            existing.setoFRebounds(updatedStats.getoFRebounds());

            logStatChange(existing, "Defensive Rebounds", existing.getdFRebounds(), updatedStats.getdFRebounds());
            existing.setdFRebounds(updatedStats.getdFRebounds());

            logStatChange(existing, "Blocks", existing.getBlocks(), updatedStats.getBlocks());
            existing.setBlocks(updatedStats.getBlocks());

            logStatChange(existing, "Steals", existing.getSteals(), updatedStats.getSteals());
            existing.setSteals(updatedStats.getSteals());

            logStatChange(existing, "Turnovers", existing.getTurnovers(), updatedStats.getTurnovers());
            existing.setTurnovers(updatedStats.getTurnovers());

            logStatChange(existing, "Personal Fouls", existing.getpFouls(), updatedStats.getpFouls());
            existing.setpFouls(updatedStats.getpFouls());

            logStatChange(existing, "Defensive Fouls", existing.getdFouls(), updatedStats.getdFouls());
            existing.setdFouls(updatedStats.getdFouls());
            //Plus Minus
            existing.setPlusMinus(updatedStats.getPlusMinus());
            //Minutes
            existing.setMinutes(updatedStats.getMinutes());
            //Game Points
            existing.setGamePoints(updatedStats.getGamePoints());

            int points = (existing.getTwoPtMade() * 2)
                   + (existing.getThreePtMade() * 3)
                   + existing.getFtMade();
            existing.setGamePoints(points);
            // Update the player and game if present
            if (updatedStats.getPlayer() != null) {
                existing.setPlayer(updatedStats.getPlayer());
            }
            if (updatedStats.getGame() != null) {
                existing.setGame(updatedStats.getGame());
            }

            // Calculate the difference between the existing and updated stats for point values
            tempStat = differenceChecker(tempStat, updatedStats);

            

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
            PhysicalBasedMetricsStats existingMetrics = physicalMetricsRepo.findByBasicStats(savedBasic);

            if (existingMetrics != null) {
                PhysicalBasedMetricsStats recalculated =
                        physicalBasedMetricsStatsService.recompute(existingMetrics, savedBasic);
                physicalMetricsRepo.save(recalculated);
            } else {
                physicalBasedMetricsStatsService.createFrom(savedBasic);
            }

            return savedBasic;
        }
        return null;
    }


public BasicStats updatePractice(Long id, BasicStats updatedStats) {
        BasicStats existing = getById(id);  // Get the current stats from the database
        if (existing != null) {
            // Create a temporary copy of the existing stats to calculate the difference
            BasicStats tempStat = new BasicStats(existing);
            // Update the fields with the new values
            logStatChange(existing, "Two-Pointer Attempts", existing.getTwoPtAttempts(), updatedStats.getTwoPtAttempts());
            existing.setTwoPtAttempts(updatedStats.getTwoPtAttempts());

            logStatChange(existing, "Two-Pointer Made", existing.getTwoPtMade(), updatedStats.getTwoPtMade());
            existing.setTwoPtMade(updatedStats.getTwoPtMade());

            logStatChange(existing, "Three-Pointer Attempts", existing.getThreePtAttempts(), updatedStats.getThreePtAttempts());
            existing.setThreePtAttempts(updatedStats.getThreePtAttempts());

            logStatChange(existing, "Three-Pointer Made", existing.getThreePtMade(), updatedStats.getThreePtMade());
            existing.setThreePtMade(updatedStats.getThreePtMade());

            logStatChange(existing, "Free Throw Attempts", existing.getFtAttempts(), updatedStats.getFtAttempts());
            existing.setFtAttempts(updatedStats.getFtAttempts());

            logStatChange(existing, "Free Throws Made", existing.getFtMade(), updatedStats.getFtMade());
            existing.setFtMade(updatedStats.getFtMade());
            //Assist update
            existing.setAssists(updatedStats.getAssists());
        
            logStatChange(existing, "Offensive Rebounds", existing.getoFRebounds(), updatedStats.getoFRebounds());
            existing.setoFRebounds(updatedStats.getoFRebounds());

            logStatChange(existing, "Defensive Rebounds", existing.getdFRebounds(), updatedStats.getdFRebounds());
            existing.setdFRebounds(updatedStats.getdFRebounds());

            logStatChange(existing, "Blocks", existing.getBlocks(), updatedStats.getBlocks());
            existing.setBlocks(updatedStats.getBlocks());

            logStatChange(existing, "Steals", existing.getSteals(), updatedStats.getSteals());
            existing.setSteals(updatedStats.getSteals());

            logStatChange(existing, "Turnovers", existing.getTurnovers(), updatedStats.getTurnovers());
            existing.setTurnovers(updatedStats.getTurnovers());

            logStatChange(existing, "Personal Fouls", existing.getpFouls(), updatedStats.getpFouls());
            existing.setpFouls(updatedStats.getpFouls());

            logStatChange(existing, "Defensive Fouls", existing.getdFouls(), updatedStats.getdFouls());
            existing.setdFouls(updatedStats.getdFouls());
            //Plus Minus
            existing.setPlusMinus(updatedStats.getPlusMinus());
            //Minutes
            existing.setMinutes(updatedStats.getMinutes());
            //Game Points
            existing.setGamePoints(updatedStats.getGamePoints());

            int points = (existing.getTwoPtMade() * 2)
                   + (existing.getThreePtMade() * 3)
                   + existing.getFtMade();
            existing.setGamePoints(points);
            // Update the player and game if present
            if (updatedStats.getPlayer() != null) {
                existing.setPlayer(updatedStats.getPlayer());
            }
            if (updatedStats.getGame() != null) {
                existing.setGame(updatedStats.getGame());
            }

            // Calculate the difference between the existing and updated stats for point values
            tempStat = differenceChecker(tempStat, updatedStats);

            

            // If the player was subbed in, update the PlusMinus for subbed-in players

            updatePracticeSubbedInPlusMinus(tempStat, tempStat.getGamePoints());
            

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
            PhysicalBasedMetricsStats existingMetrics = physicalMetricsRepo.findByBasicStats(savedBasic);

            if (existingMetrics != null) {
                PhysicalBasedMetricsStats recalculated =
                        physicalBasedMetricsStatsService.recompute(existingMetrics, savedBasic);
                physicalMetricsRepo.save(recalculated);
            } else {
                physicalBasedMetricsStatsService.createFrom(savedBasic);
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

    public List<BasicStatsDTO> getSubbedInStatsOpp(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndSubbedInTrueAndOpponentTrue(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public List<BasicStatsDTO> getSubbedOutStatsOpp(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndSubbedInFalseAndOpponentTrue(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public List<BasicStatsDTO> getSubbedInStatsOppFalse(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndSubbedInTrueAndOpponentFalse(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public List<BasicStatsDTO> getSubbedOutStatsOppFalse(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndSubbedInFalseAndOpponentFalse(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public List<BasicStatsDTO> getOppFalse(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndOpponentFalse(gameId);
        return stats.stream()
                    .map(BasicStatsMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public List<BasicStatsDTO> getOppTrue(Long gameId) {
        List<BasicStats> stats = basicStatsRepository.findByGame_GameIdAndOpponentTrue(gameId);
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

    private void updatePracticeSubbedInPlusMinus(BasicStats variation, int pointDelta) {
        if (variation.getGame() == null || pointDelta == 0) return;
        if(variation.isOpponent()==true){
            List<BasicStats> subbedInTeam = basicStatsRepository
                .findByGame_GameIdAndSubbedInTrueAndOpponentFalse(variation.getGame().getGameId());
            List<BasicStats> subbedInOpponent = basicStatsRepository
                .findByGame_GameIdAndSubbedInTrueAndOpponentTrue(variation.getGame().getGameId());
            
            for (BasicStats stats : subbedInOpponent) {
                // Calculate the point difference
                int previousPoints = stats.getPlusMinus();  // This is the previous gamePoints value
                int currentPoints = variation.getGamePoints();  // This is the updated gamePoints value

                // Calculate the point difference (delta)
                int pointDifference =  previousPoints-currentPoints;

                // Log the pointDifference for debugging
                System.out.println("Point Difference for player " + stats.getBasicStatId() + ": " + pointDifference);

                // Update the PlusMinus by subtracting the pointDifference from the current PlusMinus
                int newPlusMinus = pointDifference;
                stats.setPlusMinus(newPlusMinus);

                // Log the new PlusMinus value for debugging
                System.out.println("Updated PlusMinus for player " + stats.getBasicStatId() + ": " + newPlusMinus);
            }
            for (BasicStats stats : subbedInTeam) {
                int updatedPlusMinus = stats.getPlusMinus() + pointDelta;
                stats.setPlusMinus(updatedPlusMinus);

                System.out.println("Updated PlusMinus for Player " + stats.getPlayer().getPlayerId()
                        + ": " + updatedPlusMinus);
            }

            basicStatsRepository.saveAll(subbedInOpponent);
            basicStatsRepository.saveAll(subbedInTeam);
        }
        else if (variation.isOpponent()==false){
            List<BasicStats> subbedInTeam = basicStatsRepository
                .findByGame_GameIdAndSubbedInTrueAndOpponentTrue(variation.getGame().getGameId());
            List<BasicStats> subbedInOpponent = basicStatsRepository
                .findByGame_GameIdAndSubbedInTrueAndOpponentFalse(variation.getGame().getGameId());
            
            for (BasicStats stats : subbedInOpponent) {
                    // Calculate the point difference
                    int previousPoints = stats.getPlusMinus();  // This is the previous gamePoints value
                    int currentPoints = variation.getGamePoints();  // This is the updated gamePoints value

                    // Calculate the point difference (delta)
                    int pointDifference =  previousPoints-currentPoints;

                    // Log the pointDifference for debugging
                    System.out.println("Point Difference for player " + stats.getBasicStatId() + ": " + pointDifference);

                    // Update the PlusMinus by subtracting the pointDifference from the current PlusMinus
                    int newPlusMinus = pointDifference;
                    stats.setPlusMinus(newPlusMinus);

                    // Log the new PlusMinus value for debugging
                    System.out.println("Updated PlusMinus for player " + stats.getBasicStatId() + ": " + newPlusMinus);
            }
            for (BasicStats stats : subbedInTeam) {
                int updatedPlusMinus = stats.getPlusMinus() + pointDelta;
                stats.setPlusMinus(updatedPlusMinus);

                System.out.println("Updated PlusMinus for Player " + stats.getPlayer().getPlayerId()
                        + ": " + updatedPlusMinus);
            }

            basicStatsRepository.saveAll(subbedInOpponent);
            basicStatsRepository.saveAll(subbedInTeam);
        }
    }
     @Transactional
    public List<BasicStats> updateBatch(List<BasicStatsDTO> statsDTOList) {
        // List to store updated stats
        List<BasicStats> updatedStatsList = new ArrayList<>();
        
        for (BasicStatsDTO dto : statsDTOList) {
            Optional<BasicStats> optionalStat = basicStatsRepository.findById(dto.getBasicStatId());
            
            if (optionalStat.isPresent()) {
                BasicStats existingStat = optionalStat.get();

                // Update only the fields that are present in the DTO
                if (dto.getTwoPtAttempts() != 0) existingStat.setTwoPtAttempts(dto.getTwoPtAttempts());
                if (dto.getTwoPtMade() != 0) existingStat.setTwoPtMade(dto.getTwoPtMade());
                if (dto.getThreePtAttempts() != 0) existingStat.setThreePtAttempts(dto.getThreePtAttempts());
                if (dto.getThreePtMade() != 0) existingStat.setThreePtMade(dto.getThreePtMade());
                if (dto.getFtAttempts() != 0) existingStat.setFtAttempts(dto.getFtAttempts());
                if (dto.getFtMade() != 0) existingStat.setFtMade(dto.getFtMade());
                if (dto.getAssists() != 0) existingStat.setAssists(dto.getAssists());
                if (dto.getoFRebounds() != 0) existingStat.setoFRebounds(dto.getoFRebounds());
                if (dto.getdFRebounds() != 0) existingStat.setdFRebounds(dto.getdFRebounds());
                if (dto.getBlocks() != 0) existingStat.setBlocks(dto.getBlocks());
                if (dto.getSteals() != 0) existingStat.setSteals(dto.getSteals());
                if (dto.getTurnovers() != 0) existingStat.setTurnovers(dto.getTurnovers());
                if (dto.getpFouls() != 0) existingStat.setpFouls(dto.getpFouls());
                if (dto.getdFouls() != 0) existingStat.setdFouls(dto.getdFouls());
                if (dto.getPlusMinus() != 0) existingStat.setPlusMinus(dto.getPlusMinus());
                if (dto.getMinutes() != null) existingStat.setMinutes(dto.getMinutes());
                if (dto.getGamePoints() != 0) existingStat.setGamePoints(dto.getGamePoints());
                if (dto.isSubbedIn() != existingStat.isSubbedIn()) existingStat.setSubbedIn(dto.isSubbedIn());
                if (dto.isOpponent() != existingStat.isOpponent()) existingStat.setOpponent(dto.isOpponent());
                
                // Save updated entity
                updatedStatsList.add(basicStatsRepository.save(existingStat));
            }
        }
        return updatedStatsList;
    }
    private void logStatChange(BasicStats basicStats, String statName, int oldValue, int newValue) {
        // Only log if there's a change in the stat
        if (oldValue != newValue) {
            int difference = newValue - oldValue;
            String action = difference > 0 ? "added" : "subtracted";  // Action based on the sign of the difference
            int absDifference = Math.abs(difference); // Absolute difference to show in the message

            String logMessage = generateLogMessage(basicStats, statName, action, absDifference);

            // Save to PlayByPlay entity
            PlayByPlay playByPlay = new PlayByPlay();
            playByPlay.setMessage(logMessage);
            playByPlay.setGameId(basicStats.getGame().getGameId());
            playByPlay.setPlayerId(basicStats.getPlayer().getPlayerId());
            playByPlay.setTimestamp(LocalDateTime.now());
            playByPlayRepository.save(playByPlay);
        }
    }

    private String generateLogMessage(BasicStats basicStats, String statName, String action, int difference) {
        String playerName = basicStats.getPlayer().getFname() + " " + basicStats.getPlayer().getLname();

        switch (statName) {
            case "Two-Pointer Attempts":
                return playerName + "'s attempts were " + action + " by " + difference;
            case "Two-Pointer Made":
                return playerName + " made " + (action.equals("added") ? "" : "fewer") + " two pointers";
            case "Three-Pointer Attempts":
                return playerName + "'s attempts were " + action + " by " + difference;
            case "Three-Pointer Made":
                return playerName + " made " + (action.equals("added") ? "" : "fewer") + " three pointers";
            case "Free Throw Attempts":
                return playerName + "'s free throw attempts were " + action + " by " + difference;
            case "Free Throws Made":
                return playerName + " made " + (action.equals("added") ? "" : "fewer") + " free throws";
            case "Offensive Rebounds":
                return playerName + "'s offensive rebounds were " + action + " by " + difference;
            case "Defensive Rebounds":
                return playerName + "'s defensive rebounds were " + action + " by " + difference;
            case "Blocks":
                return playerName + " " + (action.equals("added") ? "blocked" : "fewer blocks") + " shots";
            case "Steals":
                return playerName + " " + (action.equals("added") ? "got" : "fewer steals") + " steals";
            case "Turnovers":
                return playerName + " " + (action.equals("added") ? "turned over" : "fewer turnovers") + " the ball";
            case "Personal Fouls":
                return playerName + " had " + (action.equals("added") ? "more" : "fewer") + " personal fouls";
            case "Defensive Fouls":
                return playerName + " had " + (action.equals("added") ? "more" : "fewer") + " defensive fouls";
            default:
                return playerName + " made an unknown action";
        }
    }
}

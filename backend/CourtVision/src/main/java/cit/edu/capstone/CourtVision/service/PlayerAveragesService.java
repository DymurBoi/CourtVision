package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class PlayerAveragesService {

    @Autowired
    private BasicStatsRepository basicStatsRepo;

    @Autowired
    private PlayerRepository playerRepo;

    @Autowired
    private PlayerAveragesRepository averagesRepo;

    /**
     * Called when a new Player is created.
     * Creates an empty PlayerAverages with zero stats.
     */
    public PlayerAverages createInitialAveragesForPlayer(Player player) {
        PlayerAverages avg = new PlayerAverages();
        avg.setPlayer(player);
        avg.setPointsPerGame(0);
        avg.setAssistsPerGame(0);
        avg.setReboundsPerGame(0);
        avg.setStealsPerGame(0);
        avg.setBlocksPerGame(0);
        avg.setMinutesPerGame(0);
        avg.setTrueShootingPercentage(0);
        avg.setUsagePercentage(0);
        avg.setOffensiveRating(0);
        avg.setDefensiveRating(0);

        return averagesRepo.save(avg);
    }

    /**
     * Called whenever BasicStats are created or updated.
     * Recalculates the player's averages from all their BasicStats.
     */
    public PlayerAverages updateAverages(Long playerId) {
    Player player = playerRepo.findById(playerId).orElse(null);
    if (player == null) return null;

    List<BasicStats> statsList = basicStatsRepo.findByPlayer(player);
    if (statsList == null || statsList.isEmpty()) return null;

    int totalGames = statsList.size();
    double totalPoints = 0, totalAssists = 0, totalRebounds = 0;
    double totalSteals = 0, totalBlocks = 0, totalMinutes = 0;

    double totalFGA = 0, totalFGM = 0, totalFTA = 0, totalFTM = 0, totalThreePA = 0, totalThreePM = 0;
    double totalTurnovers = 0;

    for (BasicStats b : statsList) {
        totalPoints += (b.getTwoPtMade() * 2) + (b.getThreePtMade() * 3) + b.getFtMade();
        totalAssists += b.getAssists();
        totalRebounds += b.getoFRebounds() + b.getdFRebounds();
        totalSteals += b.getSteals();
        totalBlocks += b.getBlocks();
        if (b.getMinutes() != null)
            totalMinutes += b.getMinutes().toLocalTime().toSecondOfDay() / 60.0;

        totalFGA += b.getTwoPtAttempts() + b.getThreePtAttempts();
        totalFGM += b.getTwoPtMade() + b.getThreePtMade();
        totalFTA += b.getFtAttempts();
        totalFTM += b.getFtMade();
        totalThreePA += b.getThreePtAttempts();
        totalThreePM += b.getThreePtMade();
        totalTurnovers += b.getTurnovers();
    }

    PlayerAverages avg = averagesRepo.findByPlayer(player);
    if (avg == null) {
        avg = new PlayerAverages();
        avg.setPlayer(player);
    }

    avg.setPointsPerGame(totalPoints / totalGames);
    avg.setAssistsPerGame(totalAssists / totalGames);
    avg.setReboundsPerGame(totalRebounds / totalGames);
    avg.setStealsPerGame(totalSteals / totalGames);
    avg.setBlocksPerGame(totalBlocks / totalGames);
    avg.setMinutesPerGame(totalMinutes / totalGames);

    // True Shooting Percentage (TS%)
    double tsDenominator = (2 * (totalFGA + 0.44 * totalFTA));
    double ts = tsDenominator != 0 ? totalPoints / tsDenominator : 0;
    avg.setTrueShootingPercentage(ts * 100);

    // Usage Percentage (estimated: FGA + TOV + 0.44 * FTA per minute)
    double usageNumerator = totalFGA + totalTurnovers + 0.44 * totalFTA;
    double usage = totalMinutes != 0 ? usageNumerator / totalMinutes : 0;
    avg.setUsagePercentage(usage);

    // Offensive Rating
    double pointsPerMinute = totalMinutes != 0 ? totalPoints / totalMinutes : 0;
    double possessionsUsed = totalFGA + (0.44 * totalFTA) + totalTurnovers;
    double possessionsPerMinute = totalMinutes != 0 ? possessionsUsed / totalMinutes : 0;
    double offensiveRating = (possessionsPerMinute != 0)
            ? (pointsPerMinute / possessionsPerMinute) * 100
            : 0;
    if (offensiveRating > 130) offensiveRating = 130;
    if (offensiveRating < 70) offensiveRating = 70;
    avg.setOffensiveRating(offensiveRating);

    // Defensive Rating
    double defensiveImpact = totalSteals + totalBlocks + (totalRebounds * 0.3);
    double impactPerMinute = totalMinutes != 0 ? defensiveImpact / totalMinutes : 0;
    double defensiveRating = 110 - (impactPerMinute * 10);
    if (defensiveRating < 85) defensiveRating = 85;
    if (defensiveRating > 130) defensiveRating = 130;
    avg.setDefensiveRating(defensiveRating);

    return averagesRepo.save(avg);
}


    public List<PlayerAverages> getAll() {
        return averagesRepo.findAll();
    }

    public PlayerAverages getByPlayerId(Long playerId) {
        Player player = playerRepo.findById(playerId).orElse(null);
        return player != null ? averagesRepo.findByPlayer(player) : null;
    }

    public void delete(Long id) {
        averagesRepo.deleteById(id);
    }

    //get players by team and position
    private List<PlayerAverages> getPlayers(Long teamId, String position) {
        List<PlayerAverages> result = new ArrayList<>();
        List<PlayerAverages> all = averagesRepo.findAll();

        for (PlayerAverages avg : all) {
            if (avg.getPlayer() != null &&
                avg.getPlayer().getTeam() != null &&
                avg.getPlayer().getTeam().getTeamId().equals(teamId) &&
                avg.getPlayer().getPosition().equalsIgnoreCase(position)) {
                result.add(avg);
            }
        }
        return result;
    }

    // Rank Point Guards: Assists > Points
    public List<PlayerAverages> rankPointGuards(Long teamId) {
        List<PlayerAverages> players = getPlayers(teamId, "Point Guard");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getAssistsPerGame() != p1.getAssistsPerGame()) {
                    return Double.compare(p2.getAssistsPerGame(), p1.getAssistsPerGame());
                }
                return Double.compare(p2.getPointsPerGame(), p1.getPointsPerGame());
            }
        });

        return players;
    }

    // Seasonal ranking methods (based only on BasicStats from a given season)
    private List<PlayerAverages> computeSeasonalAveragesForPosition(Long teamId, Long seasonId, String position) {
        List<PlayerAverages> result = new ArrayList<>();

        // get all players in team
        List<Player> teamPlayers = playerRepo.findByTeam_TeamId(teamId);

        for (Player p : teamPlayers) {
            String ppos = p.getPosition() == null ? "" : p.getPosition().trim().toLowerCase();
            String want = position == null ? "" : position.trim().toLowerCase();
            if (ppos.isEmpty()) continue;
            // allow minor variations: compare normalized strings
            if (!ppos.equals(want)) continue;

            // fetch basic stats for this player in the season for the given team.
            // Use Game->Season->Team join to strictly ensure stats belong to that team in that season.
            List<BasicStats> statsList = basicStatsRepo.findByPlayer_PlayerIdAndGame_Season_IdAndGame_Team_TeamId(p.getPlayerId(), seasonId, teamId);
            if (statsList == null || statsList.isEmpty()) {
                // fallback to Game->Season without team filter
                statsList = basicStatsRepo.findByPlayer_PlayerIdAndGame_Season_Id(p.getPlayerId(), seasonId);
            }
            if (statsList == null || statsList.isEmpty()) {
                // last fallback: BasicStats.season field
                statsList = basicStatsRepo.findByPlayer_PlayerIdAndSeason_Id(p.getPlayerId(), seasonId);
            }
            if (statsList == null || statsList.isEmpty()) continue;

            // compute aggregated values similar to updateAverages
            int totalGames = statsList.size();
            double totalPoints = 0, totalAssists = 0, totalRebounds = 0;
            double totalSteals = 0, totalBlocks = 0, totalMinutes = 0;
            double totalFGA = 0, totalFGM = 0, totalFTA = 0, totalFTM = 0, totalThreePA = 0, totalThreePM = 0;
            double totalTurnovers = 0;

            for (BasicStats b : statsList) {
                totalPoints += (b.getTwoPtMade() * 2) + (b.getThreePtMade() * 3) + b.getFtMade();
                totalAssists += b.getAssists();
                totalRebounds += b.getoFRebounds() + b.getdFRebounds();
                totalSteals += b.getSteals();
                totalBlocks += b.getBlocks();
                if (b.getMinutes() != null)
                    totalMinutes += b.getMinutes().toLocalTime().toSecondOfDay() / 60.0;

                totalFGA += b.getTwoPtAttempts() + b.getThreePtAttempts();
                totalFGM += b.getTwoPtMade() + b.getThreePtMade();
                totalFTA += b.getFtAttempts();
                totalFTM += b.getFtMade();
                totalThreePA += b.getThreePtAttempts();
                totalThreePM += b.getThreePtMade();
                totalTurnovers += b.getTurnovers();
            }

            PlayerAverages avg = new PlayerAverages();
            avg.setPlayer(p);
            avg.setPointsPerGame(totalPoints / totalGames);
            avg.setAssistsPerGame(totalAssists / totalGames);
            avg.setReboundsPerGame(totalRebounds / totalGames);
            avg.setStealsPerGame(totalSteals / totalGames);
            avg.setBlocksPerGame(totalBlocks / totalGames);
            avg.setMinutesPerGame(totalMinutes / totalGames);

            result.add(avg);
        }

        return result;
    }

    public List<PlayerAverages> rankPointGuardsBySeason(Long teamId, Long seasonId) {
        List<PlayerAverages> players = computeSeasonalAveragesForPosition(teamId, seasonId, "Point Guard");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getAssistsPerGame() != p1.getAssistsPerGame()) {
                    return Double.compare(p2.getAssistsPerGame(), p1.getAssistsPerGame());
                }
                return Double.compare(p2.getPointsPerGame(), p1.getPointsPerGame());
            }
        });

        return players;
    }

    public List<PlayerAverages> rankShootingGuardsBySeason(Long teamId, Long seasonId) {
        List<PlayerAverages> players = computeSeasonalAveragesForPosition(teamId, seasonId, "Shooting Guard");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getPointsPerGame() != p1.getPointsPerGame()) {
                    return Double.compare(p2.getPointsPerGame(), p1.getPointsPerGame());
                }
                return Double.compare(p2.getAssistsPerGame(), p1.getAssistsPerGame());
            }
        });

        return players;
    }

    public List<PlayerAverages> rankSmallForwardsBySeason(Long teamId, Long seasonId) {
        List<PlayerAverages> players = computeSeasonalAveragesForPosition(teamId, seasonId, "Small Forward");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getPointsPerGame() != p1.getPointsPerGame()) {
                    return Double.compare(p2.getPointsPerGame(), p1.getPointsPerGame());
                }
                return Double.compare(p2.getReboundsPerGame(), p1.getReboundsPerGame());
            }
        });

        return players;
    }

    public List<PlayerAverages> rankPowerForwardsBySeason(Long teamId, Long seasonId) {
        List<PlayerAverages> players = computeSeasonalAveragesForPosition(teamId, seasonId, "Power Forward");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getReboundsPerGame() != p1.getReboundsPerGame()) {
                    return Double.compare(p2.getReboundsPerGame(), p1.getReboundsPerGame());
                }
                return Double.compare(p2.getBlocksPerGame(), p1.getBlocksPerGame());
            }
        });

        return players;
    }

    public List<PlayerAverages> rankCentersBySeason(Long teamId, Long seasonId) {
        List<PlayerAverages> players = computeSeasonalAveragesForPosition(teamId, seasonId, "Center");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getBlocksPerGame() != p1.getBlocksPerGame()) {
                    return Double.compare(p2.getBlocksPerGame(), p1.getBlocksPerGame());
                }
                return Double.compare(p2.getReboundsPerGame(), p1.getReboundsPerGame());
            }
        });

        return players;
    }

    // Rank Shooting Guards: Points > Assists
    public List<PlayerAverages> rankShootingGuards(Long teamId) {
        List<PlayerAverages> players = getPlayers(teamId, "Shooting Guard");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getPointsPerGame() != p1.getPointsPerGame()) {
                    return Double.compare(p2.getPointsPerGame(), p1.getPointsPerGame());
                }
                return Double.compare(p2.getAssistsPerGame(), p1.getAssistsPerGame());
            }
        });

        return players;
    }

    // Rank Small Forwards: Points > Rebounds
    public List<PlayerAverages> rankSmallForwards(Long teamId) {
        List<PlayerAverages> players = getPlayers(teamId, "Small Forward");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getPointsPerGame() != p1.getPointsPerGame()) {
                    return Double.compare(p2.getPointsPerGame(), p1.getPointsPerGame());
                }
                return Double.compare(p2.getReboundsPerGame(), p1.getReboundsPerGame());
            }
        });

        return players;
    }

    // Rank Power Forwards: Rebounds > Blocks
    public List<PlayerAverages> rankPowerForwards(Long teamId) {
        List<PlayerAverages> players = getPlayers(teamId, "Power Forward");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getReboundsPerGame() != p1.getReboundsPerGame()) {
                    return Double.compare(p2.getReboundsPerGame(), p1.getReboundsPerGame());
                }
                return Double.compare(p2.getBlocksPerGame(), p1.getBlocksPerGame());
            }
        });

        return players;
    }

    // Rank Centers: Blocks > Rebounds
    public List<PlayerAverages> rankCenters(Long teamId) {
        List<PlayerAverages> players = getPlayers(teamId, "Center");

        Collections.sort(players, new Comparator<PlayerAverages>() {
            public int compare(PlayerAverages p1, PlayerAverages p2) {
                if (p2.getBlocksPerGame() != p1.getBlocksPerGame()) {
                    return Double.compare(p2.getBlocksPerGame(), p1.getBlocksPerGame());
                }
                return Double.compare(p2.getReboundsPerGame(), p1.getReboundsPerGame());
            }
        });

        return players;
    }
}

package cit.edu.capstone.CourtVision.entity;

import cit.edu.capstone.CourtVision.dto.PhysicalBasedMetricsStatsDTO;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameId;

    private String gameName;
    private LocalDate gameDate;
    private String gameResult;
    private String finalScore;
    
    private String comments;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToOne
    @JoinColumn(name = "advanced_stats_id")
    private AdvancedStats advancedStats;
    @OneToOne
    @JoinColumn(name = "physical_based_metric_stats_id")
    private PhysicalBasedMetricsStats physicalBasedMetricsStats;

    @OneToMany(mappedBy = "game") // One Game → Many PlayerAverages
    private List<PlayerAverages> playerAverages;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BasicStats> basicStatsList;

    // Getters and Setters


    public List<BasicStats> getBasicStatsList() {
        return basicStatsList;
    }

    public void setBasicStatsList(List<BasicStats> basicStatsList) {
        this.basicStatsList = basicStatsList;
    }

    public String getGameResult() {
        return gameResult;
    }

    public void setGameResult(String gameResult) {
        this.gameResult = gameResult;
    }

    public String getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(String finalScore) {
        this.finalScore = finalScore;
    }
    public PhysicalBasedMetricsStats getPhysicalBasedMetricsStats() {
        return physicalBasedMetricsStats;
    }

    public void setPhysicalBasedMetricsStats(PhysicalBasedMetricsStats physicalBasedMetricsStats) {
        this.physicalBasedMetricsStats = physicalBasedMetricsStats;
    }

    public AdvancedStats getAdvancedStats() {
        return advancedStats;
    }

    public void setAdvancedStats(AdvancedStats advancedStats) {
        this.advancedStats = advancedStats;
    }

    public List<PlayerAverages> getPlayerAverages() {
        return playerAverages;
    }

    public void setPlayerAverages(List<PlayerAverages> playerAverages) {
        this.playerAverages = playerAverages;
    }

    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }

    public String getGameName() { return gameName; }
    public void setGameName(String gameName) { this.gameName = gameName; }

    public LocalDate getGameDate() { return gameDate; }
    public void setGameDate(LocalDate gameDate) { this.gameDate = gameDate; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }


    //private Long advancedStatId;
    //private Long adjustedStatId;
}

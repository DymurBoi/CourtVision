package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameId;

    private String gameName;
    // Game Types (Scrimmage, Practice, Official Match)
    private String gameType;
    // Recording Types (Live, Post Game)
    private String recordingType;
    private LocalDate gameDate;
    private String gameResult;
    private String finalScore;
    
    private String comments;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToMany(mappedBy = "game")
    private List<BasicStats> basicStatsList;

    @OneToMany(mappedBy = "game")
    private List<BasicStatsVariation> basicStatsVarList;

    @OneToMany(mappedBy = "game")
    private List<AdvancedStats> advancedStats;
    @OneToMany
    @JoinColumn(name = "physical_based_metric_stats_id")
    private List<PhysicalBasedMetricsStats> physicalBasedMetricsStats;

    @OneToMany(mappedBy = "game") // One Game → Many PlayerAverages
    private List<PlayerAverages> playerAverages;

    // Getters and Setters


    public List<BasicStats> getBasicStatsList() {
        return basicStatsList;
    }
    public String getRecordingType() {
        return recordingType;
    }
    
    public void setRecordingType(String recordingType) {
        this.recordingType = recordingType;
    }

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }
    public void setBasicStatsList(List<BasicStats> basicStatsList) {
        this.basicStatsList = basicStatsList;
    }

    public List<AdvancedStats> getAdvancedStats() {
        return advancedStats;
    }

    public void setAdvancedStats(List<AdvancedStats> advancedStats) {
        this.advancedStats = advancedStats;
    }

    public List<PhysicalBasedMetricsStats> getPhysicalBasedMetricsStats() {
        return physicalBasedMetricsStats;
    }

    public void setPhysicalBasedMetricsStats(List<PhysicalBasedMetricsStats> physicalBasedMetricsStats) {
        this.physicalBasedMetricsStats = physicalBasedMetricsStats;
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

    public List<BasicStats> getBasicStats() { return basicStatsList; }
    public void setBasicStats(List<BasicStats> basicStatsList) { this.basicStatsList = basicStatsList; }


    public List<BasicStatsVariation> getBasicStatsVarList() {
        return basicStatsVarList;
    }
    public void setBasicStatsVarList(List<BasicStatsVariation> basicStatsVarList) {
        this.basicStatsVarList = basicStatsVarList;
    }
    //private Long advancedStatId;
    //private Long adjustedStatId;
}

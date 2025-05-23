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
    private LocalDate gameDate;
    private String gameResult;
    private String finalScore;
    private String comments;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToOne
    @JoinColumn(name = "basic_stat_id")
    private BasicStats basicStats;

    @OneToOne
    @JoinColumn(name = "advanced_stat_id")
    private AdvancedStats advancedStats;

    @OneToOne
    @JoinColumn(name = "adjusted_stat_id")
    private AdjustedStats adjustedStats;

    @OneToMany(mappedBy = "game")
    private List<PlayerAverages> playerAverages;

    // Getters and Setters

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

    public AdjustedStats getAdjustedStats() {
        return adjustedStats;
    }

    public void setAdjustedStats(AdjustedStats adjustedStats) {
        this.adjustedStats = adjustedStats;
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

    public BasicStats getBasicStats() { return basicStats; }
    public void setBasicStats(BasicStats basicStats) { this.basicStats = basicStats; }
}

package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameId;

    private String gameName;
    private LocalDate gameDate;
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

    // Getters and Setters
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

    //private Long advancedStatId;
    //private Long adjustedStatId;
}

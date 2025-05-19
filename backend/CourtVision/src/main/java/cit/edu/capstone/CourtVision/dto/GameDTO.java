package cit.edu.capstone.CourtVision.dto;

import java.time.LocalDate;
import java.util.List;

public class GameDTO {
    private Long gameId;
    private String gameName;
    private LocalDate gameDate;
    private String comments;
    private TeamDTO team;
    private BasicStatsDTO basicStats;
    private AdvancedStatsDTO advancedStats;
    private List<PlayerAveragesDTO> playerAverages;

    // Getters and Setters

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public LocalDate getGameDate() {
        return gameDate;
    }

    public void setGameDate(LocalDate gameDate) {
        this.gameDate = gameDate;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }

    public BasicStatsDTO getBasicStats() {
        return basicStats;
    }

    public void setBasicStats(BasicStatsDTO basicStats) {
        this.basicStats = basicStats;
    }

    public AdvancedStatsDTO getAdvancedStats() {
        return advancedStats;
    }

    public void setAdvancedStats(AdvancedStatsDTO advancedStats) {
        this.advancedStats = advancedStats;
    }

    public List<PlayerAveragesDTO> getPlayerAverages() {
        return playerAverages;
    }

    public void setPlayerAverages(List<PlayerAveragesDTO> playerAverages) {
        this.playerAverages = playerAverages;
    }
}


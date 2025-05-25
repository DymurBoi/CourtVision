package cit.edu.capstone.CourtVision.dto;

import java.time.LocalDate;

public class GameDTO {
    private Long gameId;
    private String gameName;
    private LocalDate gameDate;
    private String gameResult;
    private String finalScore;
    private String comments;
    private Long teamId;
    private Long basicStatId;
    private Long advancedStatId;
    private Long adjustedStatId;

    // Constructors
    public GameDTO() {
    }

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

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getBasicStatId() {
        return basicStatId;
    }

    public void setBasicStatId(Long basicStatId) {
        this.basicStatId = basicStatId;
    }

    public Long getAdvancedStatId() {
        return advancedStatId;
    }

    public void setAdvancedStatId(Long advancedStatId) {
        this.advancedStatId = advancedStatId;
    }

    public Long getAdjustedStatId() {
        return adjustedStatId;
    }

    public void setAdjustedStatId(Long adjustedStatId) {
        this.adjustedStatId = adjustedStatId;
    }
} 
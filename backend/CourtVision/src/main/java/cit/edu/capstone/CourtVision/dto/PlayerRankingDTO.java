package cit.edu.capstone.CourtVision.dto;

public class PlayerRankingDTO {
    private Long playerId;
    private String playerName;
    private String teamName;
    private String position;
    private Double averagePoints;
    private Double averageRebounds;
    private Double averageAssists;
    private Double averageBlocks;
    private Integer rank;

    
    public Long getPlayerId() {
        return playerId;
    }
    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }
    public String getPlayerName() {
        return playerName;
    }
    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
    public String getTeamName() {
        return teamName;
    }
    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }
    public String getPosition() {
        return position;
    }
    public void setPosition(String position) {
        this.position = position;
    }
    public Double getAveragePoints() {
        return averagePoints;
    }
    public void setAveragePoints(Double averagePoints) {
        this.averagePoints = averagePoints;
    }
    public Double getAverageRebounds() {
        return averageRebounds;
    }
    public void setAverageRebounds(Double averageRebounds) {
        this.averageRebounds = averageRebounds;
    }
    public Double getAverageAssists() {
        return averageAssists;
    }
    public void setAverageAssists(Double averageAssists) {
        this.averageAssists = averageAssists;
    }
    public Double getAverageBlocks() {
        return averageBlocks;
    }
    public void setAverageBlocks(Double averageBlocks) {
        this.averageBlocks = averageBlocks;
    }
    public Integer getRank() {
        return rank;
    }
    public void setRank(Integer rank) {
        this.rank = rank;
    }

    
}

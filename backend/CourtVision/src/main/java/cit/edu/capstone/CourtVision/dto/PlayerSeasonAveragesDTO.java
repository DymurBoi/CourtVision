package cit.edu.capstone.CourtVision.dto;

public class PlayerSeasonAveragesDTO {
    private Long playerId;
    private Long seasonId;
    private double avgPoints;
    private double avgRebounds;
    private double avgAssists;
    private double avgSteals;
    private double avgBlocks;
    private double avgTurnovers;

    // Constructors
    public PlayerSeasonAveragesDTO() {}

    public PlayerSeasonAveragesDTO(Long playerId, Long seasonId, double avgPoints, double avgRebounds,
                                   double avgAssists, double avgSteals, double avgBlocks, double avgTurnovers) {
        this.playerId = playerId;
        this.seasonId = seasonId;
        this.avgPoints = avgPoints;
        this.avgRebounds = avgRebounds;
        this.avgAssists = avgAssists;
        this.avgSteals = avgSteals;
        this.avgBlocks = avgBlocks;
        this.avgTurnovers = avgTurnovers;
    }

    //Getters and Setters

    public double getAvgTurnovers() {
        return avgTurnovers;
    }

    public void setAvgTurnovers(double avgTurnovers) {
        this.avgTurnovers = avgTurnovers;
    }

    public double getAvgBlocks() {
        return avgBlocks;
    }

    public void setAvgBlocks(double avgBlocks) {
        this.avgBlocks = avgBlocks;
    }

    public double getAvgSteals() {
        return avgSteals;
    }

    public void setAvgSteals(double avgSteals) {
        this.avgSteals = avgSteals;
    }

    public double getAvgAssists() {
        return avgAssists;
    }

    public void setAvgAssists(double avgAssists) {
        this.avgAssists = avgAssists;
    }

    public double getAvgRebounds() {
        return avgRebounds;
    }

    public void setAvgRebounds(double avgRebounds) {
        this.avgRebounds = avgRebounds;
    }

    public double getAvgPoints() {
        return avgPoints;
    }

    public void setAvgPoints(double avgPoints) {
        this.avgPoints = avgPoints;
    }

    public Long getSeasonId() {
        return seasonId;
    }

    public void setSeasonId(Long seasonId) {
        this.seasonId = seasonId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }
}

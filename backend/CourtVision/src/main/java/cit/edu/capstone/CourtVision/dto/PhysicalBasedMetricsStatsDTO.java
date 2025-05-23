package cit.edu.capstone.CourtVision.dto;

public class PhysicalBasedMetricsStatsDTO {
    private Long id;
    private double athleticPerformanceIndex;
    private double defensiveDisruptionRating;
    private double reboundPotentialIndex;
    private double mobilityAdjustedBuildScore;
    private double positionSuitabilityIndex;

    private BasicStatsDTO basicStatsDTO;
    private GameDTO gameDTO;

    //Getters and Setters


    public BasicStatsDTO getBasicStatsDTO() {
        return basicStatsDTO;
    }

    public void setBasicStatsDTO(BasicStatsDTO basicStatsDTO) {
        this.basicStatsDTO = basicStatsDTO;
    }

    public GameDTO getGameDTO() {
        return gameDTO;
    }

    public void setGameDTO(GameDTO gameDTO) {
        this.gameDTO = gameDTO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAthleticPerformanceIndex() {
        return athleticPerformanceIndex;
    }

    public void setAthleticPerformanceIndex(double athleticPerformanceIndex) {
        this.athleticPerformanceIndex = athleticPerformanceIndex;
    }

    public double getDefensiveDisruptionRating() {
        return defensiveDisruptionRating;
    }

    public void setDefensiveDisruptionRating(double defensiveDisruptionRating) {
        this.defensiveDisruptionRating = defensiveDisruptionRating;
    }

    public double getReboundPotentialIndex() {
        return reboundPotentialIndex;
    }

    public void setReboundPotentialIndex(double reboundPotentialIndex) {
        this.reboundPotentialIndex = reboundPotentialIndex;
    }

    public double getMobilityAdjustedBuildScore() {
        return mobilityAdjustedBuildScore;
    }

    public void setMobilityAdjustedBuildScore(double mobilityAdjustedBuildScore) {
        this.mobilityAdjustedBuildScore = mobilityAdjustedBuildScore;
    }

    public double getPositionSuitabilityIndex() {
        return positionSuitabilityIndex;
    }

    public void setPositionSuitabilityIndex(double positionSuitabilityIndex) {
        this.positionSuitabilityIndex = positionSuitabilityIndex;
    }
}
package cit.edu.capstone.CourtVision.dto;

public class PhysicalBasedMetricsStatsDTO {
    private Long physicalBasedMetricsStatsId;

    private double finishingEfficiency;
    private double reboundingEfficiency;
    private double defensiveActivityIndex;
    private double physicalEfficiencyRating;

    private BasicStatsDTO basicStatsDTO;
    private GameDTO gameDTO;

    // Getters and Setters

    public Long getPhysicalBasedMetricsStatsId() {
        return physicalBasedMetricsStatsId;
    }

    public void setPhysicalBasedMetricsStatsId(Long physicalBasedMetricsStatsId) {
        this.physicalBasedMetricsStatsId = physicalBasedMetricsStatsId;
    }

    public double getFinishingEfficiency() {
        return finishingEfficiency;
    }

    public void setFinishingEfficiency(double finishingEfficiency) {
        this.finishingEfficiency = finishingEfficiency;
    }

    public double getReboundingEfficiency() {
        return reboundingEfficiency;
    }

    public void setReboundingEfficiency(double reboundingEfficiency) {
        this.reboundingEfficiency = reboundingEfficiency;
    }

    public double getDefensiveActivityIndex() {
        return defensiveActivityIndex;
    }

    public void setDefensiveActivityIndex(double defensiveActivityIndex) {
        this.defensiveActivityIndex = defensiveActivityIndex;
    }

    public double getPhysicalEfficiencyRating() {
        return physicalEfficiencyRating;
    }

    public void setPhysicalEfficiencyRating(double physicalEfficiencyRating) {
        this.physicalEfficiencyRating = physicalEfficiencyRating;
    }

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
}

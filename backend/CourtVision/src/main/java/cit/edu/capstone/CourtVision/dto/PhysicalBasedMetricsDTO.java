package cit.edu.capstone.CourtVision.dto;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.PhysicalRecords;

public class PhysicalBasedMetricsDTO {
    private double athleticPerformanceIndex;
    private double defensiveDisruptionRating;
    private double reboundPotentialIndex;
    private double mobilityAdjustedBuildScore;
    private double positionSuitabilityIndex;

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

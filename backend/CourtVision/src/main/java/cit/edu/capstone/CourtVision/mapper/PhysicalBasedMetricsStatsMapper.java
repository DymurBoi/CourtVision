package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;
import cit.edu.capstone.CourtVision.dto.PhysicalBasedMetricsStatsDTO;

public class PhysicalBasedMetricsStatsMapper {
    public static PhysicalBasedMetricsStatsDTO toDTO(PhysicalBasedMetricsStats stats) {
        PhysicalBasedMetricsStatsDTO dto = new PhysicalBasedMetricsStatsDTO();
        dto.setId(stats.getId());
        dto.setAthleticPerformanceIndex(stats.getAthleticPerformanceIndex());
        dto.setDefensiveDisruptionRating(stats.getDefensiveDisruptionRating());
        dto.setReboundPotentialIndex(stats.getReboundPotentialIndex());
        dto.setMobilityAdjustedBuildScore(stats.getMobilityAdjustedBuildScore());
        dto.setPositionSuitabilityIndex(stats.getPositionSuitabilityIndex());
        return dto;
    }
}
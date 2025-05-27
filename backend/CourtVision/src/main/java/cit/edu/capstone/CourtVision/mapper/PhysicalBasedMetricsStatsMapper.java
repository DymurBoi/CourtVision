package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.PhysicalBasedMetricsStatsDTO;
import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;

public class PhysicalBasedMetricsStatsMapper {

    public static PhysicalBasedMetricsStatsDTO toDTO(PhysicalBasedMetricsStats stats) {
        PhysicalBasedMetricsStatsDTO dto = new PhysicalBasedMetricsStatsDTO();
        dto.setPhysicalBasedMetricsStatsId(stats.getPhysicalBasedMetricsStatsId());
        dto.setAthleticPerformanceIndex(stats.getAthleticPerformanceIndex());
        dto.setDefensiveDisruptionRating(stats.getDefensiveDisruptionRating());
        dto.setReboundPotentialIndex(stats.getReboundPotentialIndex());
        dto.setMobilityAdjustedBuildScore(stats.getMobilityAdjustedBuildScore());
        dto.setPositionSuitabilityIndex(stats.getPositionSuitabilityIndex());

        if (stats.getGame() != null) {
            dto.setGameDTO(GameMapper.toDTO(stats.getGame()));
        }

        return dto;
    }
}

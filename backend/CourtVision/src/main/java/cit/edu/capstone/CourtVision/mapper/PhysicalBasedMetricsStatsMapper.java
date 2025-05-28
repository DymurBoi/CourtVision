package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;
import cit.edu.capstone.CourtVision.dto.PhysicalBasedMetricsStatsDTO;

public class PhysicalBasedMetricsStatsMapper {
    public static PhysicalBasedMetricsStatsDTO toDTO(PhysicalBasedMetricsStats stats) {
        PhysicalBasedMetricsStatsDTO dto = new PhysicalBasedMetricsStatsDTO();
        dto.setPhysicalBasedMetricsStatsId(stats.getPhysicalBasedMetricsStatsId());
        dto.setFinishingEfficiency(stats.getFinishingEfficiency());
        dto.setReboundingEfficiency(stats.getReboundingEfficiency());
        dto.setDefensiveActivityIndex(stats.getDefensiveActivityIndex());
        dto.setPhysicalEfficiencyRating(stats.getPhysicalEfficiencyRating());

        if (stats.getBasicStats() != null) {
            dto.setBasicStatsDTO(BasicStatsMapper.toDTO(stats.getBasicStats()));
        }
        if (stats.getGame() != null) {
            dto.setGameDTO(GameMapper.toDTO(stats.getGame()));
        }
        return dto;
    }
}

package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.AdvancedStatsDTO;
import cit.edu.capstone.CourtVision.entity.AdvancedStats;

public class AdvancedStatsMapper {
     public static AdvancedStatsDTO toDTO(AdvancedStats stats) {
        AdvancedStatsDTO dto = new AdvancedStatsDTO();
        dto.setAdvancedStatsId(stats.getAdvancedStatsId());
        dto.setuPER(stats.getuPER());
        dto.seteFG(stats.geteFG());
        dto.setTs(stats.getTs());
        dto.setUsg(stats.getUsg());
        dto.setAssistRatio(stats.getAssistRatio());
        dto.setTurnoverRatio(stats.getTurnoverRatio());
        dto.setPie(stats.getPie());
        dto.setOrtg(stats.getOrtg());
        dto.setDrtg(stats.getDrtg());
        dto.setRebPercentage(stats.getRebPercentage());
        dto.setOrbPercentage(stats.getOrbPercentage());
        dto.setDrbPercentage(stats.getDrbPercentage());
        dto.setAstPercentage(stats.getAstPercentage());
        dto.setStlPercentage(stats.getStlPercentage());
        dto.setBlkPercentage(stats.getBlkPercentage());
        dto.setTovPercentage(stats.getTovPercentage());
        dto.setFtr(stats.getFtr());

        if (stats.getBasicStats() != null) {
            dto.setBasicStatsDTO(BasicStatsMapper.toDTO(stats.getBasicStats()));
        }
        if (stats.getGame() != null) {
           dto.setGameDTO(GameMapper.toDTO(stats.getGame()));
        }
        return dto;
    }

    
}


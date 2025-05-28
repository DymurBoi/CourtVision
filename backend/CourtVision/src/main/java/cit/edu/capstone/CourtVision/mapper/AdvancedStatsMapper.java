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
      dto.setOrtg(stats.getOrtg());
      dto.setFtr(stats.getFtr());

      // NEW FIELDS
      dto.setAtRatio(stats.getAtRatio());
      dto.setFtPercentage(stats.getFtPercentage());
      dto.setUsgPercentage(stats.getUsgPercentage());
      dto.setPointsPerMinute(stats.getPointsPerMinute());
      dto.setShootingEfficiency(stats.getShootingEfficiency());
      dto.setPointsPerShot(stats.getPointsPerShot());

      if (stats.getBasicStats() != null) {
         dto.setBasicStatsDTO(BasicStatsMapper.toDTO(stats.getBasicStats()));
      }

      if (stats.getGame() != null) {
         dto.setGameDTO(GameMapper.toDTO(stats.getGame()));
      }

      return dto;
   }
}

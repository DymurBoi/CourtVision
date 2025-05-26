package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.BasicStats;

public class BasicStatsMapper {

   public static BasicStatsDTO toDTO(BasicStats stat) {
        BasicStatsDTO dto = new BasicStatsDTO();
        dto.setBasicStatId(stat.getBasicStatId());
        dto.setTwoPtAttempts(stat.getTwoPtAttempts());
        dto.setTwoPtMade(stat.getTwoPtMade());
        dto.setThreePtAttempts(stat.getThreePtAttempts());
        dto.setThreePtMade(stat.getThreePtMade());
        dto.setFtAttempts(stat.getFtAttempts());
        dto.setFtMade(stat.getFtMade());
        dto.setAssists(stat.getAssists());
        dto.setoFRebounds(stat.getoFRebounds());
        dto.setdFRebounds(stat.getdFRebounds());
        dto.setBlocks(stat.getBlocks());
        dto.setSteals(stat.getSteals());
        dto.setTurnovers(stat.getTurnovers());
        dto.setpFouls(stat.getpFouls());
        dto.setdFouls(stat.getdFouls());
        dto.setPlusMinus(stat.getPlusMinus());
        dto.setMinutes(stat.getMinutes());



        if (stat.getGame() != null) {
            dto.setGameDTO(GameMapper.toDTO(stat.getGame()));
        }

        return dto;
    }

}

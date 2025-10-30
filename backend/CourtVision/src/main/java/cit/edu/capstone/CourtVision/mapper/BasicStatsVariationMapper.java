package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.dto.BasicStatsVariationDTO;
import cit.edu.capstone.CourtVision.entity.BasicStatsVariation;

public class BasicStatsVariationMapper {

 public static BasicStatsVariationDTO toDTO(BasicStatsVariation stat) {
        BasicStatsVariationDTO dto = new BasicStatsVariationDTO();
        dto.setBasicStatVarId(stat.getBasicStatVarId());
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
        dto.setGamePoints(stat.getGamePoints());
        if (stat.getGame() != null) {
            dto.setGameId(stat.getGame().getGameId());
        }
        return dto;
    }

    public static BasicStatsVariation toEntity(BasicStatsVariationDTO dto) {
        BasicStatsVariation stat = new BasicStatsVariation();
        stat.setBasicStatVarId(dto.getBasicStatVarId());
        stat.setTwoPtAttempts(dto.getTwoPtAttempts());
        stat.setTwoPtMade(dto.getTwoPtMade());
        stat.setThreePtAttempts(dto.getThreePtAttempts());
        stat.setThreePtMade(dto.getThreePtMade());
        stat.setFtAttempts(dto.getFtAttempts());
        stat.setFtMade(dto.getFtMade());
        stat.setAssists(dto.getAssists());
        stat.setoFRebounds(dto.getoFRebounds());
        stat.setdFRebounds(dto.getdFRebounds());
        stat.setBlocks(dto.getBlocks());
        stat.setSteals(dto.getSteals());
        stat.setTurnovers(dto.getTurnovers());
        stat.setpFouls(dto.getpFouls());
        stat.setdFouls(dto.getdFouls());
        stat.setPlusMinus(dto.getPlusMinus());
        stat.setMinutes(dto.getMinutes());
        stat.setGamePoints(dto.getGamePoints());
        // You may need to set Game object here if needed
        return stat;

}
}

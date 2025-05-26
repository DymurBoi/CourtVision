package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.PlayerAveragesDTO;
import cit.edu.capstone.CourtVision.entity.PlayerAverages;

public class PlayerAveragesMapper {
    public static PlayerAveragesDTO toDto(PlayerAverages avg) {
        PlayerAveragesDTO dto = new PlayerAveragesDTO();
        dto.setPlayerAvgId(avg.getPlayerAvgId());

        if (avg.getPlayer() != null) {
            dto.setPlayer(PlayerMapper.toDto(avg.getPlayer()));
        }

        if (avg.getGame() != null) {
            dto.setGame(GameMapper.toDTO(avg.getGame()));
        }

        dto.setPointsPerGame(avg.getPointsPerGame());
        dto.setAssistsPerGame(avg.getAssistsPerGame());
        dto.setReboundsPerGame(avg.getReboundsPerGame());
        dto.setStealsPerGame(avg.getStealsPerGame());
        dto.setBlocksPerGame(avg.getBlocksPerGame());
        dto.setMinutesPerGame(avg.getMinutesPerGame());
        dto.setTrueShootingPercentage(avg.getTrueShootingPercentage());
        dto.setUsagePercentage(avg.getUsagePercentage());
        dto.setOffensiveRating(avg.getOffensiveRating());
        dto.setDefensiveRating(avg.getDefensiveRating());

        return dto;
    }
}

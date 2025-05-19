package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.GameDTO;
import cit.edu.capstone.CourtVision.entity.Game;

public class GameMapper {

    public static GameDTO toDTO(Game game) {
        GameDTO dto = new GameDTO();
        dto.setGameId(game.getGameId());
        dto.setGameName(game.getGameName());
        dto.setGameDate(game.getGameDate());
        dto.setComments(game.getComments());

        if (game.getTeam() != null) {
            dto.setTeam(TeamMapper.toDTO(game.getTeam()));
        }

        if (game.getBasicStats() != null) {
            dto.setBasicStats(BasicStatsMapper.toDTO(game.getBasicStats()));
        }

        if (game.getAdvancedStats() != null) {
            dto.setAdvancedStats(AdvancedStatsMapper.toDTO(game.getAdvancedStats()));
        }

        // Skipping playerAverages for now to avoid infinite recursion (you can optionally include it)

        return dto;
    }
}


package cit.edu.capstone.CourtVision.dto;

import cit.edu.capstone.CourtVision.entity.Game;

public class GameMapper {
    public static GameDTO toDto(Game game) {
        if (game == null) return null;

        GameDTO dto = new GameDTO();
        dto.setGameId(game.getGameId());
        dto.setGameName(game.getGameName());
        dto.setGameDate(game.getGameDate());
        dto.setGameResult(game.getGameResult());
        dto.setFinalScore(game.getFinalScore());
        dto.setComments(game.getComments());
        
        if (game.getTeam() != null) {
            dto.setTeamId(game.getTeam().getTeamId());
        }
        
        if (game.getBasicStats() != null) {
            dto.setBasicStatId(game.getBasicStats().getBasicStatId());
        }
        
//        if (game.getAdvancedStats() != null) {
//            dto.setAdvancedStatId(game.getAdvancedStats().getAdvancedStatId());
//        }
//
//        if (game.getAdjustedStats() != null) {
//            dto.setAdjustedStatId(game.getAdjustedStats().getAdjustedStatId());
//        }

        return dto;
    }

    public static Game toEntity(GameDTO dto) {
        if (dto == null) return null;

        Game game = new Game();
        game.setGameId(dto.getGameId());
        game.setGameName(dto.getGameName());
        game.setGameDate(dto.getGameDate());
        game.setGameResult(dto.getGameResult());
        game.setFinalScore(dto.getFinalScore());
        game.setComments(dto.getComments());
        
        return game;
    }
} 
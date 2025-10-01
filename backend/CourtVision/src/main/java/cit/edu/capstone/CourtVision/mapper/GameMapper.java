package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.GameDTO;
import cit.edu.capstone.CourtVision.entity.Game;

import java.util.List;
import java.util.stream.Collectors;

public class GameMapper {

    public static GameDTO toDTO(Game game) {
        GameDTO dto = new GameDTO();
        dto.setGameId(game.getGameId());
        dto.setGameName(game.getGameName());
        dto.setGameType(game.getGameType());
        dto.setRecordingType(game.getRecordingType());
        dto.setGameDate(game.getGameDate());
        dto.setGameResult(game.getGameResult());
        dto.setFinalScore(game.getFinalScore());
        dto.setComments(game.getComments());

        if (game.getTeam() != null) {
            dto.setTeamId(game.getTeam().getTeamId());
        }

        // Populate the list of BasicStats IDs
        if (game.getBasicStats() != null) {
            List<Long> basicStatIds = game.getBasicStats().stream()
                                          .map(basicStats -> basicStats.getBasicStatId())
                                          .collect(Collectors.toList());
            dto.setBasicStatIds(basicStatIds);
        }

        return dto;
    }
}

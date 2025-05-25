package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.GameDTO;
import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.Team;

public class GameMapper {

    public static GameDTO toDTO(Game game) {
        GameDTO dto = new GameDTO();
        dto.setGameId(game.getGameId());
        dto.setGameName(game.getGameName());
        dto.setGameDate(game.getGameDate());
        dto.setGameResult(game.getGameResult());
        dto.setFinalScore(game.getFinalScore());
        dto.setComments(game.getComments());
        

        if (game.getTeam() != null) {
            Team temp=new Team();
            temp=game.getTeam();
            dto.setTeamId(temp.getTeamId());
        }

        if (game.getBasicStats() != null) {
            BasicStats temp=new BasicStats();
            temp=game.getBasicStats();
            dto.setBasicStatId(temp.getBasicStatId());
        }

        if (game.getAdvancedStats() != null) {
            AdvancedStats temp=new AdvancedStats();
            temp=game.getAdvancedStats();
            dto.setAdvancedStatId(temp.getId());
        }

        // Skipping playerAverages for now to avoid infinite recursion (you can optionally include it)

        return dto;
    }
}


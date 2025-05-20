package cit.edu.capstone.CourtVision.mapper;

import java.util.stream.Collectors;

import cit.edu.capstone.CourtVision.dto.TeamDTO;
import cit.edu.capstone.CourtVision.entity.Team;

public class TeamMapper {
    public static TeamDTO toDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setTeamId(team.getTeamId());
        dto.setTeamName(team.getTeamName());


        if (team.getPlayers() != null) {
            dto.setPlayers(team.getPlayers().stream()
                    .map(PlayerMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        if (team.getGames() != null) {
            dto.setGames(team.getGames().stream()
                    .map(GameMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}

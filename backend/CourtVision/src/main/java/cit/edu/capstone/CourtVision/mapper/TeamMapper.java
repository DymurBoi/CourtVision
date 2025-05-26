package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.CoachDTO;
import cit.edu.capstone.CourtVision.dto.TeamDTO;
import cit.edu.capstone.CourtVision.entity.Team;

import java.util.stream.Collectors;

public class TeamMapper {
    public static TeamDTO toDto(Team team) {
        if (team == null) return null;

        TeamDTO dto = new TeamDTO();
        dto.setTeamId(team.getTeamId());
        dto.setTeamName(team.getTeamName());

        // Map coaches
        if (team.getCoaches() != null) {
            dto.setCoaches(team.getCoaches().stream()
                    .map(coach -> new CoachDTO(
                            coach.getCoachId(),
                            coach.getFname(),
                            coach.getLname(),
                            coach.getEmail()
                    ))
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static Team toEntity(TeamDTO dto) {
        if (dto == null) return null;

        Team team = new Team();
        team.setTeamId(dto.getTeamId());
        team.setTeamName(dto.getTeamName());
        return team;
    }
}
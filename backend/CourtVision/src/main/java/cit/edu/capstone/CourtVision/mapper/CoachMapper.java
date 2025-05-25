package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.CoachDTO;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.Team;

import java.util.List;
import java.util.stream.Collectors;

public class CoachMapper {

    public static CoachDTO toDTO(Coach coach) {
        CoachDTO dto = new CoachDTO();
        dto.setCoachId(coach.getCoachId());
        dto.setFname(coach.getFname());
        dto.setLname(coach.getLname());
        dto.setEmail(coach.getEmail());
        dto.setBirthDate(coach.getBirthDate());

        if (coach.getTeams() != null && !coach.getTeams().isEmpty()) {
            List<Long> teamIds = coach.getTeams().stream()
                                      .map(Team::getTeamId) // Extracting the teamId
                                      .collect(Collectors.toList());
            dto.setTeamId(teamIds); // Set the list of teamIds in the DTO
        }

        return dto;
    }
}

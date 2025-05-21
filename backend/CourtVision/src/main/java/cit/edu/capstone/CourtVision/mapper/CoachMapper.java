package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.CoachDTO;
import cit.edu.capstone.CourtVision.entity.Coach;

import java.util.stream.Collectors;

public class CoachMapper {

    public static CoachDTO toDTO(Coach coach) {
        CoachDTO dto = new CoachDTO();
        dto.setCoachId(coach.getCoachId());
        dto.setFname(coach.getFname());
        dto.setLname(coach.getLname());
        dto.setEmail(coach.getEmail());
        dto.setPassword(coach.getPassword());
        dto.setBirthDate(coach.getBirthDate());


        return dto;
    }
}

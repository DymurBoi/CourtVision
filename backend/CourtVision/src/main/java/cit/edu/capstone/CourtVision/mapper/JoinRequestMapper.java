package cit.edu.capstone.CourtVision.mapper;
import cit.edu.capstone.CourtVision.dto.*;
import cit.edu.capstone.CourtVision.entity.JoinRequest;

public class JoinRequestMapper {
    public static JoinRequestDTO toDto(JoinRequest joinRequest) {
        if (joinRequest == null) return null;
        JoinRequestDTO dto = new JoinRequestDTO();
        dto.setRequestId(joinRequest.getRequestId());

        // Player data
        if (joinRequest.getPlayer() != null) {
            dto.setPlayerId(joinRequest.getPlayer().getPlayerId());
            dto.setPlayerName(joinRequest.getPlayer().getFname() + " " + joinRequest.getPlayer().getLname());
        }

        // Coach data
        if (joinRequest.getCoach() != null) {
            dto.setCoachId(joinRequest.getCoach().getCoachId());
            dto.setCoachName(joinRequest.getCoach().getFname() + " " + joinRequest.getCoach().getLname());
        }

        // Team data
        if (joinRequest.getTeam() != null) {
            dto.setTeamId(joinRequest.getTeam().getTeamId());
            dto.setTeamName(joinRequest.getTeam().getTeamName());
        }

        dto.setRequestStatus(joinRequest.getRequestStatus());
        return dto;
    }

    public static JoinRequest toEntity(JoinRequestDTO dto) {
        if (dto == null) return null;
        JoinRequest entity = new JoinRequest();
        entity.setRequestId(dto.getRequestId());
        // Player, Coach, Team should be set in the service/controller using their repositories
        entity.setRequestStatus(dto.getRequestStatus());
        return entity;
    }
} 
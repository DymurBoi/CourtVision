package cit.edu.capstone.CourtVision.dto;

import cit.edu.capstone.CourtVision.entity.PhysicalUpdateRequest;

public class PhysicalUpdateRequestMapper {
    public static PhysicalUpdateRequestDTO toDto(PhysicalUpdateRequest physicalUpdateRequest) {
        if (physicalUpdateRequest == null) return null;
        
        PhysicalUpdateRequestDTO dto = new PhysicalUpdateRequestDTO();
        dto.setRequestId(physicalUpdateRequest.getRequestId());
        
        // Set player info
        if (physicalUpdateRequest.getPlayer() != null) {
            dto.setPlayerId(physicalUpdateRequest.getPlayer().getPlayerId());
            dto.setPlayerName(physicalUpdateRequest.getPlayer().getFname() + " " + physicalUpdateRequest.getPlayer().getLname());
        }
        
        // Set coach info
        if (physicalUpdateRequest.getCoach() != null) {
            dto.setCoachId(physicalUpdateRequest.getCoach().getCoachId());
            dto.setCoachName(physicalUpdateRequest.getCoach().getFname() + " " + physicalUpdateRequest.getCoach().getLname());
        }
        
        // Set team info
        if (physicalUpdateRequest.getTeam() != null) {
            dto.setTeamId(physicalUpdateRequest.getTeam().getTeamId());
            dto.setTeamName(physicalUpdateRequest.getTeam().getTeamName());
        }
        
        // Set physical stats
        dto.setWeight(physicalUpdateRequest.getWeight());
        dto.setHeight(physicalUpdateRequest.getHeight());
        dto.setWingspan(physicalUpdateRequest.getWingspan());
        dto.setVertical(physicalUpdateRequest.getVertical());
        dto.setDateRequested(physicalUpdateRequest.getDateRequested());
        dto.setRequestStatus(physicalUpdateRequest.getRequestStatus());
        
        return dto;
    }
    
    public static PhysicalUpdateRequest toEntity(PhysicalUpdateRequestDTO dto) {
        if (dto == null) return null;
        
        PhysicalUpdateRequest entity = new PhysicalUpdateRequest();
        entity.setRequestId(dto.getRequestId());
        entity.setWeight(dto.getWeight());
        entity.setHeight(dto.getHeight());
        entity.setWingspan(dto.getWingspan());
        entity.setVertical(dto.getVertical());
        entity.setDateRequested(dto.getDateRequested());
        entity.setRequestStatus(dto.getRequestStatus());
        
        return entity;
    }
} 
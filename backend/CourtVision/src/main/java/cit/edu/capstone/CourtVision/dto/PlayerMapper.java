package cit.edu.capstone.CourtVision.dto;

import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;

public class PlayerMapper {

    public static PlayerDTO toDto(Player player) {
        if (player == null) return null;

        PlayerDTO dto = new PlayerDTO();
        dto.setPlayerId(player.getPlayerId());
        dto.setFname(player.getFname());
        dto.setLname(player.getLname());
        dto.setEmail(player.getEmail());
        dto.setBirthDate(player.getBirthDate());
        dto.setJerseyNum(player.getJerseyNum());
        dto.setIsCoach(player.getIsCoach());
        dto.setIsAdmin(player.getIsAdmin());

        // Map team information
        if (player.getTeam() != null) {
            dto.setTeam(toDto(player.getTeam()));
        }

        if (player.getPhysicalRecords() != null) {
            dto.setPhysicalRecords(toDto(player.getPhysicalRecords()));
        }

        return dto;
    }

    public static PhysicalRecordDTO toDto(PhysicalRecords record) {
        if (record == null) return null;

        PhysicalRecordDTO dto = new PhysicalRecordDTO();
        dto.setRecordId(record.getRecordId());
        dto.setWeight(record.getWeight());
        dto.setHeight(record.getHeight());
        dto.setWingspan(record.getWingspan());
        dto.setVertical(record.getVertical());
        dto.setBmi(record.getBmi());
        dto.setDateRecorded(record.getDateRecorded());

        return dto;
    }

    public static TeamDTO toDto(Team team) {
        if (team == null) return null;

        TeamDTO dto = new TeamDTO();
        dto.setTeamId(team.getTeamId());
        dto.setTeamName(team.getTeamName());
        return dto;
    }
}

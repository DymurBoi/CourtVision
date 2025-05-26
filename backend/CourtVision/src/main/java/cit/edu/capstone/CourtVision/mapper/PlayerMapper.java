package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.PhysicalRecordDTO;
import cit.edu.capstone.CourtVision.dto.PlayerDTO;
import cit.edu.capstone.CourtVision.dto.TeamDTO;
import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.mapper.TeamMapper;

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


        // Map team using TeamMapper
        if (player.getTeam() != null) {
            dto.setTeam(TeamMapper.toDto(player.getTeam()));
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

    public static Player toEntity(PlayerDTO dto) {
        if (dto == null) return null;

        Player player = new Player();
        player.setPlayerId(dto.getPlayerId());
        player.setFname(dto.getFname());
        player.setLname(dto.getLname());
        player.setEmail(dto.getEmail());
        player.setBirthDate(dto.getBirthDate());
        player.setJerseyNum(dto.getJerseyNum());
        return player;
    }
}

package cit.edu.capstone.CourtVision.mapper;

import cit.edu.capstone.CourtVision.dto.PhysicalRecordDTO;
import cit.edu.capstone.CourtVision.dto.PlayerDTO;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;

public class PlayerMapper {

    public static PlayerDTO toDTO(Player player) {
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
        
        if(player.getTeam()!=null){
            Team temp=new Team();
            temp=player.getTeam();
            dto.setTeamId(temp.getTeamId());
            dto.setTeamName(temp.getTeamName());
        }
        if (player.getPhysicalRecords() != null) {
            dto.setPhysicalRecords(toDto(player.getPhysicalRecords()));
        }
        if (player.getBasicStats() != null) {
            BasicStats temp=new BasicStats();
            temp=player.getBasicStats();
            BasicStatsMapper mapper=new BasicStatsMapper();
            dto.setBasicStats(mapper.toDTO(temp));
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
}

package cit.edu.capstone.CourtVision.dto;

import java.time.LocalDate;
import java.util.List;

public class PlayerDTO {
    private Long playerId;
    private String fname;
    private String lname;
    private String email;
    private LocalDate birthDate;
    private int jerseyNum;
    private boolean isCoach;
    private boolean isAdmin;
    private String position;
    

    // Team data
    private TeamDTO team;
    private Long teamId;
    private String teamName;

    private PhysicalRecordDTO physicalRecords;
    private List<BasicStatsDTO> basicStatsList;

    // Getters and Setters
    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }
    
    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public int getJerseyNum() {
        return jerseyNum;
    }

    public void setJerseyNum(int jerseyNum) {
        this.jerseyNum = jerseyNum;
    }

    public boolean isCoach() {
        return isCoach;
    }

    public void setIsCoach(boolean isCoach) {
        this.isCoach = isCoach;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public PhysicalRecordDTO getPhysicalRecords() {
        return physicalRecords;
    }

    public void setPhysicalRecords(PhysicalRecordDTO physicalRecords) {
        this.physicalRecords = physicalRecords;
    }

    public List<BasicStatsDTO> getBasicStatsList() {
        return basicStatsList;
    }

    public void setBasicStatsList(List<BasicStatsDTO> basicStatsList) {
        this.basicStatsList = basicStatsList;
    }
}

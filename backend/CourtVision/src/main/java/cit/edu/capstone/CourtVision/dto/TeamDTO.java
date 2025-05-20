package cit.edu.capstone.CourtVision.dto;

public class TeamDTO {
    private Long teamId;
    private String teamName;
    
    // Constructors
    public TeamDTO() {
    }
    
    public TeamDTO(Long teamId, String teamName) {
        this.teamId = teamId;
        this.teamName = teamName;
    }
    
    // Getters and Setters
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
} 
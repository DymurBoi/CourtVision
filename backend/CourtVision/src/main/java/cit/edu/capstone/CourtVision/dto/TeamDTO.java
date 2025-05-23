package cit.edu.capstone.CourtVision.dto;

import java.util.List;

public class TeamDTO {
    private Long teamId;
    private String teamName;
    private List<CoachDTO> coaches;
    
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

    public List<CoachDTO> getCoaches() {
        return coaches;
    }

    public void setCoaches(List<CoachDTO> coaches) {
        this.coaches = coaches;
    }
} 
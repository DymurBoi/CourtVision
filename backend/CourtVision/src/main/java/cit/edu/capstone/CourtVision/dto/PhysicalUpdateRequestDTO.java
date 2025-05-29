package cit.edu.capstone.CourtVision.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PhysicalUpdateRequestDTO {
    private Long requestId;
    private Long playerId;
    private String playerName;
    private Integer coachId;
    private String coachName;
    private Long teamId;
    private String teamName;
    private double weight;
    private double height;
    private double wingspan;
    private double vertical;
    private LocalDate dateRequested;
    private int requestStatus;

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public Integer getCoachId() { return coachId; }
    public void setCoachId(Integer coachId) { this.coachId = coachId; }

    public String getCoachName() { return coachName; }
    public void setCoachName(String coachName) { this.coachName = coachName; }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }

    public double getWingspan() { return wingspan; }
    public void setWingspan(double wingspan) { this.wingspan = wingspan; }

    public double getVertical() { return vertical; }
    public void setVertical(double vertical) { this.vertical = vertical; }

    public LocalDate getDateRequested() { return dateRequested; }
    public void setDateRequested(LocalDate dateRequested) { this.dateRequested = dateRequested; }

    public int getRequestStatus() { return requestStatus; }
    public void setRequestStatus(int requestStatus) { this.requestStatus = requestStatus; }
} 
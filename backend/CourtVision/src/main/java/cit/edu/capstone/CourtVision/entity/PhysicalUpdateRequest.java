package cit.edu.capstone.CourtVision.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
public class PhysicalUpdateRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = true) // Make nullable for backward compatibility
    private Coach coach; // This will be deprecated but kept for compatibility

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    
    @OneToMany(mappedBy = "physicalUpdateRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PhysicalUpdateRequestCoach> requestCoaches;

    private BigDecimal weight;
    private BigDecimal height;
    private BigDecimal wingspan;
    private BigDecimal vertical;
    private LocalDate dateRequested;
    private int requestStatus; // 0: Pending, 1: Approved, 2: Rejected

    // Getters and Setters
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Player getPlayer() { return player; }
    public void setPlayer(Player player) { this.player = player; }

    public Coach getCoach() { return coach; }
    public void setCoach(Coach coach) { this.coach = coach; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    
    public List<PhysicalUpdateRequestCoach> getRequestCoaches() { return requestCoaches; }
    public void setRequestCoaches(List<PhysicalUpdateRequestCoach> requestCoaches) { this.requestCoaches = requestCoaches; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public BigDecimal getWingspan() { return wingspan; }
    public void setWingspan(BigDecimal wingspan) { this.wingspan = wingspan; }

    public BigDecimal getVertical() { return vertical; }
    public void setVertical(BigDecimal vertical) { this.vertical = vertical; }

    public LocalDate getDateRequested() { return dateRequested; }
    public void setDateRequested(LocalDate dateRequested) { this.dateRequested = dateRequested; }

    public int getRequestStatus() { return requestStatus; }
    public void setRequestStatus(int requestStatus) { this.requestStatus = requestStatus; }
} 
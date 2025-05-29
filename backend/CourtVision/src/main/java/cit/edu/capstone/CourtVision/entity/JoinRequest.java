package cit.edu.capstone.CourtVision.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class JoinRequest {
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
    
    @OneToMany(mappedBy = "joinRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    
    private List<JoinRequestCoach> requestCoaches;

    private int requestStatus;

    // Getters and Setters
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Player getPlayer() { return player; }
    public void setPlayer(Player player) { this.player = player; }

    public Coach getCoach() { return coach; }
    public void setCoach(Coach coach) { this.coach = coach; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    
    public List<JoinRequestCoach> getRequestCoaches() { return requestCoaches; }
    public void setRequestCoaches(List<JoinRequestCoach> requestCoaches) { this.requestCoaches = requestCoaches; }

    public int getRequestStatus() { return requestStatus; }
    public void setRequestStatus(int requestStatus) { this.requestStatus = requestStatus; }
} 
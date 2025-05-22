package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "join_request_coach")
public class JoinRequestCoach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private JoinRequest joinRequest;

    @ManyToOne
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;
    
    private int viewed; // 0 = not viewed, 1 = viewed
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public JoinRequest getJoinRequest() {
        return joinRequest;
    }
    
    public void setJoinRequest(JoinRequest joinRequest) {
        this.joinRequest = joinRequest;
    }
    
    public Coach getCoach() {
        return coach;
    }
    
    public void setCoach(Coach coach) {
        this.coach = coach;
    }
    
    public int getViewed() {
        return viewed;
    }
    
    public void setViewed(int viewed) {
        this.viewed = viewed;
    }
} 
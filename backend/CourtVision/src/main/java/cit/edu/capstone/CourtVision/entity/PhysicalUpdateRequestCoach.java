package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "physical_update_request_coach")
public class PhysicalUpdateRequestCoach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private PhysicalUpdateRequest physicalUpdateRequest;

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
    
    public PhysicalUpdateRequest getPhysicalUpdateRequest() {
        return physicalUpdateRequest;
    }
    
    public void setPhysicalUpdateRequest(PhysicalUpdateRequest physicalUpdateRequest) {
        this.physicalUpdateRequest = physicalUpdateRequest;
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
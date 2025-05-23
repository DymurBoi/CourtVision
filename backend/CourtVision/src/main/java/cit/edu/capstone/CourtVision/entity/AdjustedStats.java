package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;

@Entity
public class AdjustedStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adjustedStatId;

    @OneToOne(mappedBy = "adjustedStats")
    private Game game;

    // Getters and Setters
    public Integer getAdjustedStatId() {
        return adjustedStatId;
    }

    public void setAdjustedStatId(Integer adjustedStatId) {
        this.adjustedStatId = adjustedStatId;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }
} 
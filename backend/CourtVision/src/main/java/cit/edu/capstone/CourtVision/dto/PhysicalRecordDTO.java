package cit.edu.capstone.CourtVision.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PhysicalRecordDTO {
    private Long recordId;
    private double weight;
    private double height;
    private double wingspan;
    private double vertical;
    private double bmi;
    private LocalDate dateRecorded;
    private Long playerId;
    
    public Long getPlayerId() {
        return playerId;
    }
    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }
    public Long getRecordId() {
        return recordId;
    }
    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }
    public double getWeight() {
        return weight;
    }
    public void setWeight(double weight) {
        this.weight = weight;
    }
    public double getHeight() {
        return height;
    }
    public void setHeight(double height) {
        this.height = height;
    }
    public double getWingspan() {
        return wingspan;
    }
    public void setWingspan(double wingspan) {
        this.wingspan = wingspan;
    }
    public double getVertical() {
        return vertical;
    }
    public void setVertical(double vertical) {
        this.vertical = vertical;
    }
    public double getBmi() {
        return bmi;
    }
    public void setBmi(double bmi) {
        this.bmi = bmi;
    }
    public LocalDate getDateRecorded() {
        return dateRecorded;
    }
    public void setDateRecorded(LocalDate dateRecorded) {
        this.dateRecorded = dateRecorded;
    }

    // No Player field here to avoid recursion

    // Getters and Setters
}

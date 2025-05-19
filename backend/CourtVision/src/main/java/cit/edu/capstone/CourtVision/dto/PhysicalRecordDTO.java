package cit.edu.capstone.CourtVision.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PhysicalRecordDTO {
    private Long recordId;
    private BigDecimal weight;
    private BigDecimal height;
    private BigDecimal wingspan;
    private BigDecimal vertical;
    private BigDecimal bmi;
    private LocalDate dateRecorded;
    public Long getRecordId() {
        return recordId;
    }
    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }
    public BigDecimal getWeight() {
        return weight;
    }
    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }
    public BigDecimal getHeight() {
        return height;
    }
    public void setHeight(BigDecimal height) {
        this.height = height;
    }
    public BigDecimal getWingspan() {
        return wingspan;
    }
    public void setWingspan(BigDecimal wingspan) {
        this.wingspan = wingspan;
    }
    public BigDecimal getVertical() {
        return vertical;
    }
    public void setVertical(BigDecimal vertical) {
        this.vertical = vertical;
    }
    public BigDecimal getBmi() {
        return bmi;
    }
    public void setBmi(BigDecimal bmi) {
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

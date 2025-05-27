package cit.edu.capstone.CourtVision.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhysicalRecords {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    private BigDecimal weight;
    private BigDecimal height;
    private BigDecimal wingspan;
    private BigDecimal vertical;
    private BigDecimal bmi;
    private LocalDate dateRecorded;

    @OneToOne
    @JoinColumn(name = "player_id", referencedColumnName = "playerId")
    private Player player;

    @OneToMany(mappedBy = "physicalRecord")
    private PhysicalBasedMetricsStats physicalBasedMetricsStats;

    //Getters and Setters


    public PhysicalBasedMetricsStats getPhysicalBasedMetricsStats() {
        return physicalBasedMetricsStats;
    }

    public void setPhysicalBasedMetricsStats(PhysicalBasedMetricsStats physicalBasedMetricsStats) {
        this.physicalBasedMetricsStats = physicalBasedMetricsStats;
    }

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

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }
}

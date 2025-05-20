package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhysicalBasedMetricsStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double athleticPerformanceIndex;
    private double defensiveDisruptionRating;
    private double reboundPotentialIndex;
    private double mobilityAdjustedBuildScore;
    private double positionSuitabilityIndex;

    @OneToOne
    @JoinColumn(name = "basic_stats_id")
    private BasicStats basicStats;

    @OneToOne
    @JoinColumn(name = "game_id")
    private Game game;

    @OneToOne
    @JoinColumn(name = "physical_records_id")
    private PhysicalRecords physicalRecord;


    //Getter and Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAthleticPerformanceIndex() {
        return athleticPerformanceIndex;
    }

    public void setAthleticPerformanceIndex(double athleticPerformanceIndex) {
        this.athleticPerformanceIndex = athleticPerformanceIndex;
    }

    public double getDefensiveDisruptionRating() {
        return defensiveDisruptionRating;
    }

    public void setDefensiveDisruptionRating(double defensiveDisruptionRating) {
        this.defensiveDisruptionRating = defensiveDisruptionRating;
    }

    public double getReboundPotentialIndex() {
        return reboundPotentialIndex;
    }

    public void setReboundPotentialIndex(double reboundPotentialIndex) {
        this.reboundPotentialIndex = reboundPotentialIndex;
    }

    public double getMobilityAdjustedBuildScore() {
        return mobilityAdjustedBuildScore;
    }

    public void setMobilityAdjustedBuildScore(double mobilityAdjustedBuildScore) {
        this.mobilityAdjustedBuildScore = mobilityAdjustedBuildScore;
    }

    public double getPositionSuitabilityIndex() {
        return positionSuitabilityIndex;
    }

    public void setPositionSuitabilityIndex(double positionSuitabilityIndex) {
        this.positionSuitabilityIndex = positionSuitabilityIndex;
    }

    public BasicStats getBasicStats() {
        return basicStats;
    }

    public void setBasicStats(BasicStats basicStats) {
        this.basicStats = basicStats;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public PhysicalRecords getPhysicalRecord() {
        return physicalRecord;
    }

    public void setPhysicalRecord(PhysicalRecords physicalRecord) {
        this.physicalRecord = physicalRecord;
    }
}

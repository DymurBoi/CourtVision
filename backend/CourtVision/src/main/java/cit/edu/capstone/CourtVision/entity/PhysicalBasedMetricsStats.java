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
    private Long physicalBasedMetricsStatsId;

    private double finishingEfficiency;
    private double reboundingEfficiency;
    private double defensiveActivityIndex;
    private double physicalEfficiencyRating;

    @OneToOne
    @JoinColumn(name = "basic_stats_id")
    private BasicStats basicStats;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "physical_records_id")
    private PhysicalRecords physicalRecord;


    //Getter and Setter


    public Long getPhysicalBasedMetricsStatsId() {
        return physicalBasedMetricsStatsId;
    }

    public void setPhysicalBasedMetricsStatsId(Long physicalBasedMetricsStatsId) {
        this.physicalBasedMetricsStatsId = physicalBasedMetricsStatsId;
    }

    public double getFinishingEfficiency() {
        return finishingEfficiency;
    }

    public void setFinishingEfficiency(double finishingEfficiency) {
        this.finishingEfficiency = finishingEfficiency;
    }

    public double getReboundingEfficiency() {
        return reboundingEfficiency;
    }

    public void setReboundingEfficiency(double reboundingEfficiency) {
        this.reboundingEfficiency = reboundingEfficiency;
    }

    public double getDefensiveActivityIndex() {
        return defensiveActivityIndex;
    }

    public void setDefensiveActivityIndex(double defensiveActivityIndex) {
        this.defensiveActivityIndex = defensiveActivityIndex;
    }

    public double getPhysicalEfficiencyRating() {
        return physicalEfficiencyRating;
    }

    public void setPhysicalEfficiencyRating(double physicalEfficiencyRating) {
        this.physicalEfficiencyRating = physicalEfficiencyRating;
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

package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhysicalBasedMetricsStatsRepository extends JpaRepository<PhysicalBasedMetricsStats, Long> {
    PhysicalBasedMetricsStats findByGame(Game game);
}


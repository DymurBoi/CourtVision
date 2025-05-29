package cit.edu.capstone.CourtVision.repository;

import java.util.List;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.PhysicalBasedMetricsStats;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PhysicalBasedMetricsStatsRepository extends JpaRepository<PhysicalBasedMetricsStats, Long> {
    List<PhysicalBasedMetricsStats> findByGame(Game game);
    PhysicalBasedMetricsStats findSingleByGame(Game game);
    PhysicalBasedMetricsStats findByBasicStats(BasicStats basicStats);
}


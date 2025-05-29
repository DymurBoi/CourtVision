package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdvancedStatsRepository extends JpaRepository<AdvancedStats, Long> {
    AdvancedStats findByBasicStats(BasicStats basicStats);
    List<AdvancedStats> findByBasicStats_Game(Game game);
}
package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BasicStatsRepository extends JpaRepository<BasicStats, Long> {
    BasicStats findByGame(Game game);
}

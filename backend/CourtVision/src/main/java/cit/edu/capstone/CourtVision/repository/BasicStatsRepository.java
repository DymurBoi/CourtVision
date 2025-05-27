package cit.edu.capstone.CourtVision.repository;

import java.util.List;

import cit.edu.capstone.CourtVision.entity.BasicStats;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BasicStatsRepository extends JpaRepository<BasicStats, Long> {
    List<BasicStats> findByGame_GameId(Long gameId);
}

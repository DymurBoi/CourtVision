package cit.edu.capstone.CourtVision.repository;

import java.util.List;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Player;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BasicStatsRepository extends JpaRepository<BasicStats, Long> {
    List<BasicStats> findByGame_GameId(Long gameId);
    List<BasicStats> findByPlayerPlayerId(Long playerId);
    List<BasicStats> findByPlayer(Player player);
}

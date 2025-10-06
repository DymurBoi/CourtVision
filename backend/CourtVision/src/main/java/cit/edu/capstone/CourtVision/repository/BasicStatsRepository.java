package cit.edu.capstone.CourtVision.repository;

import java.util.List;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Player;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BasicStatsRepository extends JpaRepository<BasicStats, Long> {
    List<BasicStats> findByGame_GameId(Long gameId);
    List<BasicStats> findByPlayerPlayerId(Long playerId);
    List<BasicStats> findByPlayer(Player player);
    List<BasicStats> findByPlayer_PlayerIdAndSeasonId(Long playerId, Long seasonId);
    List<BasicStats> findByGame_GameIdAndSubbedInTrue(Long gameId);
    List<BasicStats> findByGame_GameIdAndSubbedInFalse(Long gameId);
    List<BasicStats> findByGame_GameIdAndPlayer_Team_TeamId(Long gameId, Long teamId);
    List<BasicStats> findByGame_GameIdAndPlayer_PlayerId(Long gameId, Long playerId);
    
}

package cit.edu.capstone.CourtVision.repository;

import java.util.List;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Player;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BasicStatsRepository extends JpaRepository<BasicStats, Long> {
    List<BasicStats> findByGame_GameId(Long gameId);
    List<BasicStats> findByPlayerPlayerId(Long playerId);
    List<BasicStats> findByPlayer(Player player);
    // Find basic stats for a player within a season. Some flows populate the season on the BasicStats
    // entity, while others rely on the Game -> Season relationship. Provide both repository methods
    // and prefer the Game -> Season variant in seasonal aggregations to be robust.
    List<BasicStats> findByPlayer_PlayerIdAndSeason_Id(Long playerId, Long seasonId);
    List<BasicStats> findByPlayer_PlayerIdAndGame_Season_Id(Long playerId, Long seasonId);
    List<BasicStats> findByPlayer_PlayerIdAndGame_Season_IdAndGame_Team_TeamId(Long playerId, Long seasonId, Long teamId);
    List<BasicStats> findByGame_GameIdAndSubbedInTrue(Long gameId);
    List<BasicStats> findByGame_GameIdAndSubbedInFalse(Long gameId);
    List<BasicStats> findByGame_GameIdAndPlayer_Team_TeamId(Long gameId, Long teamId);
    List<BasicStats> findByGame_GameIdAndPlayer_PlayerId(Long gameId, Long playerId);
    
}

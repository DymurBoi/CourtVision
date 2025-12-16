package cit.edu.capstone.CourtVision.repository;

import java.util.List;

import cit.edu.capstone.CourtVision.entity.PlayByPlay;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayByPlayRepository extends JpaRepository<PlayByPlay, Long> {

    // Custom query to fetch play-by-play events by game ID
    List<PlayByPlay> findByGameId(Long gameId);

    // Custom query to fetch play-by-play events by player ID
    List<PlayByPlay> findByPlayerId(Long playerId);

    // Custom query to fetch play-by-play events by player and game ID
    List<PlayByPlay> findByGameIdAndPlayerId(Long gameId, Long playerId);
}

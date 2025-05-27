package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.PlayerAverages;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerAveragesRepository extends JpaRepository<PlayerAverages, Long> {
    PlayerAverages findByPlayer(Player player);
    List<BasicStats> findByPlayerPlayerId(Long playerId);
}

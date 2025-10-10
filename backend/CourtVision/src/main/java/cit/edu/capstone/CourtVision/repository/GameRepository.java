package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByTeam(Team team);
    List<Game> findByPlayerAveragesPlayer(Player player);
    Game findByGameId(Long gameId);
}

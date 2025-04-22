package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.Player;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Integer> {
    Optional<Player> findByEmail(String email);
}

package cit.edu.capstone.CourtVision.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import cit.edu.capstone.CourtVision.entity.BasicStatsVariation;

public interface BasicStatsVariationRepository extends JpaRepository<BasicStatsVariation, Long> {
    List<BasicStatsVariation> findByGame_GameId(Long gameId);
}

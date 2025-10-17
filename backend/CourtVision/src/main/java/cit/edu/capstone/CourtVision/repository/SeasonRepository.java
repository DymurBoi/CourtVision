package cit.edu.capstone.CourtVision.repository;



import cit.edu.capstone.CourtVision.entity.Season;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeasonRepository extends JpaRepository<Season, Long> {
    List<Season> findByTeam_TeamId(Long teamId);
    List<Season> findByActiveTrue();
    List<Season> findByActiveTrueAndTeam_TeamId(Long teamId);
}


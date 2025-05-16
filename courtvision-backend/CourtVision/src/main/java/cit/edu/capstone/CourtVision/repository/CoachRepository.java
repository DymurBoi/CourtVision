package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Integer> {
    List<Coach> findByTeams_TeamId(Long teamId);
    Coach findByEmail(String email);

}


package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByAdmin_AdminId(int adminId);
    List<Team> findByCoaches_CoachId(Integer coachId);
}

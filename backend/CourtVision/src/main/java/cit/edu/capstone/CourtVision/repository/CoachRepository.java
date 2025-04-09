package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoachRepository extends JpaRepository<Coach, Integer> {
    Optional<Coach> findByEmail(String email);
}

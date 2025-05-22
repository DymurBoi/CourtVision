package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.JoinRequestCoach;
import cit.edu.capstone.CourtVision.entity.JoinRequest;
import cit.edu.capstone.CourtVision.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JoinRequestCoachRepository extends JpaRepository<JoinRequestCoach, Long> {
    List<JoinRequestCoach> findByCoach_CoachId(Integer coachId);
    List<JoinRequestCoach> findByJoinRequest_RequestId(Long requestId);
    void deleteByJoinRequest_RequestId(Long requestId);
} 
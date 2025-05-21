package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.PhysicalUpdateRequestCoach;
import cit.edu.capstone.CourtVision.entity.PhysicalUpdateRequest;
import cit.edu.capstone.CourtVision.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhysicalUpdateRequestCoachRepository extends JpaRepository<PhysicalUpdateRequestCoach, Long> {
    List<PhysicalUpdateRequestCoach> findByCoach_CoachId(Integer coachId);
    List<PhysicalUpdateRequestCoach> findByPhysicalUpdateRequest_RequestId(Long requestId);
    void deleteByPhysicalUpdateRequest_RequestId(Long requestId);
} 
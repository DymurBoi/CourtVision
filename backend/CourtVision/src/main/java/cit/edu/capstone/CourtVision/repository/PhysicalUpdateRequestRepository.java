package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.PhysicalUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhysicalUpdateRequestRepository extends JpaRepository<PhysicalUpdateRequest, Long> {
    List<PhysicalUpdateRequest> findByTeam_TeamId(Long teamId);
    List<PhysicalUpdateRequest> findByPlayer_PlayerId(Long playerId);
    List<PhysicalUpdateRequest> findByCoach_CoachId(Long coachId);
    List<PhysicalUpdateRequest> findByRequestStatus(int requestStatus);
} 
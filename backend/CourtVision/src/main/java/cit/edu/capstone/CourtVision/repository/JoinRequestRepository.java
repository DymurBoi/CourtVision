package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findByTeam_TeamId(Long teamId);
    List<JoinRequest> findByPlayer_PlayerId(Long playerId);
    List<JoinRequest> findByCoach_CoachId(Long coachId);
    List<JoinRequest> findByRequestStatus(int requestStatus);
} 
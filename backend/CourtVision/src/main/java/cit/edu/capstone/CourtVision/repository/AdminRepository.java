package cit.edu.capstone.CourtVision.repository;

import cit.edu.capstone.CourtVision.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminEntity, Integer> {
    Optional<AdminEntity> findByEmail(String email);
}

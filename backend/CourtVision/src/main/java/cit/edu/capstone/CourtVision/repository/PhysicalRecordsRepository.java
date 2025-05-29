package cit.edu.capstone.CourtVision.repository;


import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhysicalRecordsRepository extends JpaRepository<PhysicalRecords, Long> {
    PhysicalRecords findByPlayer(Player player);
}

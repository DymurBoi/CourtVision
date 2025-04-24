package cit.edu.capstone.CourtVision.service;


import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.repository.PhysicalRecordsRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhysicalRecordService {

    @Autowired
    private PhysicalRecordsRepository recordRepo;

    @Autowired
    private PlayerRepository playerRepo;

    public List<PhysicalRecords> getAll() {
        return recordRepo.findAll();
    }

    public PhysicalRecords getById(Long id) {
        return recordRepo.findById(id).orElse(null);
    }

    public PhysicalRecords getByPlayerId(Long playerId) {
        Player player = playerRepo.findById(playerId).orElse(null);
        return player != null ? recordRepo.findByPlayer(player) : null;
    }

    public PhysicalRecords save(PhysicalRecords record) {
        return recordRepo.save(record);
    }

    public PhysicalRecords update(Long id, PhysicalRecords updatedRecord) {
        updatedRecord.setRecordId(id);
        return recordRepo.save(updatedRecord);
    }

    public void delete(Long id) {
        recordRepo.deleteById(id);
    }
}

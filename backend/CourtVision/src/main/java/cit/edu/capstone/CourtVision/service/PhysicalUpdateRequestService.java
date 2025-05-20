package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.entity.PhysicalUpdateRequest;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.repository.PhysicalRecordsRepository;
import cit.edu.capstone.CourtVision.repository.PhysicalUpdateRequestRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PhysicalUpdateRequestService {
    private static final Logger logger = LoggerFactory.getLogger(PhysicalUpdateRequestService.class);

    @Autowired
    private PhysicalUpdateRequestRepository physicalUpdateRequestRepository;

    @Autowired
    private PhysicalRecordsRepository physicalRecordsRepository;

    @Autowired
    private PlayerRepository playerRepository;

    /**
     * Create a new physical update request
     * @param physicalUpdateRequest The request details
     * @return The saved request
     */
    public PhysicalUpdateRequest createRequest(PhysicalUpdateRequest physicalUpdateRequest) {
        physicalUpdateRequest.setDateRequested(LocalDate.now());
        physicalUpdateRequest.setRequestStatus(0); // Set status as pending
        return physicalUpdateRequestRepository.save(physicalUpdateRequest);
    }

    /**
     * Get all physical update requests
     * @return List of all requests
     */
    public List<PhysicalUpdateRequest> getAllRequests() {
        return physicalUpdateRequestRepository.findAll();
    }

    /**
     * Get a specific request by ID
     * @param requestId The request ID
     * @return The request if found, null otherwise
     */
    public PhysicalUpdateRequest getRequestById(Long requestId) {
        return physicalUpdateRequestRepository.findById(requestId).orElse(null);
    }

    /**
     * Get all requests for a specific coach
     * @param coachId The coach ID
     * @return List of requests for this coach
     */
    public List<PhysicalUpdateRequest> getRequestsByCoachId(Long coachId) {
        return physicalUpdateRequestRepository.findByCoach_CoachId(coachId);
    }

    /**
     * Get all requests made by a specific player
     * @param playerId The player ID
     * @return List of requests by this player
     */
    public List<PhysicalUpdateRequest> getRequestsByPlayerId(Long playerId) {
        return physicalUpdateRequestRepository.findByPlayer_PlayerId(playerId);
    }

    /**
     * Update a physical update request status and apply changes if approved
     * @param requestId The request ID
     * @param newRequest The updated request data
     * @return The updated request
     */
    @Transactional
    public PhysicalUpdateRequest updateRequest(Long requestId, PhysicalUpdateRequest newRequest) {
        PhysicalUpdateRequest existing = getRequestById(requestId);
        if (existing == null) {
            throw new RuntimeException("Request not found with ID: " + requestId);
        }

        // Update the request status
        existing.setRequestStatus(newRequest.getRequestStatus());
        
        // If request is approved (status = 1), update the player's physical records
        if (newRequest.getRequestStatus() == 1) {
            Player player = existing.getPlayer();
            PhysicalRecords physicalRecords = player.getPhysicalRecords();
            
            if (physicalRecords == null) {
                // Create new records if they don't exist
                physicalRecords = new PhysicalRecords();
                physicalRecords.setPlayer(player);
                player.setPhysicalRecords(physicalRecords);
            }
            
            // Update physical records with requested values
            physicalRecords.setHeight(existing.getHeight());
            physicalRecords.setWeight(existing.getWeight());
            physicalRecords.setWingspan(existing.getWingspan());
            physicalRecords.setVertical(existing.getVertical());
            physicalRecords.setDateRecorded(LocalDate.now());
            
            // Save the updated physical records
            physicalRecordsRepository.save(physicalRecords);
            playerRepository.save(player);
        }
        
        // Save the updated request
        return physicalUpdateRequestRepository.save(existing);
    }

    /**
     * Delete a physical update request
     * @param requestId The request ID to delete
     */
    public void deleteRequest(Long requestId) {
        physicalUpdateRequestRepository.deleteById(requestId);
    }
} 
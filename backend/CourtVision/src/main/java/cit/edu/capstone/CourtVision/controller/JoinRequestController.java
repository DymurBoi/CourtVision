package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.dto.JoinRequestDTO;
import cit.edu.capstone.CourtVision.dto.JoinRequestMapper;
import cit.edu.capstone.CourtVision.entity.JoinRequest;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import cit.edu.capstone.CourtVision.repository.CoachRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import cit.edu.capstone.CourtVision.service.JoinRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/join-requests")
public class JoinRequestController {
    @Autowired
    private JoinRequestService joinRequestService;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private CoachRepository coachRepository;
    @Autowired
    private TeamRepository teamRepository;

    @PreAuthorize("hasAuthority('ROLE_PLAYER')")
    @PostMapping
    public ResponseEntity<JoinRequestDTO> createRequest(@RequestBody JoinRequestDTO dto) {
        Optional<Player> player = playerRepository.findById(dto.getPlayerId());
        Optional<Coach> coach = coachRepository.findById(dto.getCoachId());
        Optional<Team> team = teamRepository.findById(dto.getTeamId());
        if (player.isEmpty() || coach.isEmpty() || team.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        JoinRequest entity = JoinRequestMapper.toEntity(dto);
        entity.setPlayer(player.get());
        entity.setCoach(coach.get());
        entity.setTeam(team.get());
        JoinRequest saved = joinRequestService.createRequest(entity);
        return ResponseEntity.ok(JoinRequestMapper.toDto(saved));
    }

    @GetMapping
    public List<JoinRequestDTO> getAllRequests() {
        return joinRequestService.getAllRequests().stream()
                .map(JoinRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @GetMapping("/by-coach/{coachId}")
    public List<JoinRequestDTO> getRequestsByCoach(@PathVariable Long coachId) {
        return joinRequestService.getRequestsByCoachId(coachId).stream()
                .map(JoinRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ROLE_PLAYER')")
    @GetMapping("/by-player/{playerId}")
    public List<JoinRequestDTO> getRequestsByPlayer(@PathVariable Long playerId) {
        return joinRequestService.getRequestsByPlayerId(playerId).stream()
                .map(JoinRequestMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JoinRequestDTO> getRequestById(@PathVariable Long id) {
        JoinRequest req = joinRequestService.getRequestById(id);
        if (req == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(JoinRequestMapper.toDto(req));
    }

    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<JoinRequestDTO> updateRequest(@PathVariable Long id, @RequestBody JoinRequestDTO dto) {
        JoinRequest existing = joinRequestService.getRequestById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        
        // Only update status - keep existing player/coach/team references
        existing.setRequestStatus(dto.getRequestStatus());
        
        // The JoinRequestService.updateRequest method will handle player-team assignment
        JoinRequest updated = joinRequestService.updateRequest(id, existing);
        return ResponseEntity.ok(JoinRequestMapper.toDto(updated));
    }

    @PreAuthorize("hasAuthority('ROLE_COACH') or hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        joinRequestService.deleteRequest(id);
    }
} 
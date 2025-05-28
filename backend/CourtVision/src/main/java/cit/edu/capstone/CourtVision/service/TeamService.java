package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.JoinRequest;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.CoachRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private JoinRequestService joinRequestService;

    //Get all teams
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    //Get team by ID
    public Team getTeamById(Long id) {
        return teamRepository.findById(id).orElse(null);
    }

    //Create new team
    public Team createTeam(Team team) {
        // Get currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Assuming username is email

        // Find the coach based on authenticated email
        Coach currentCoach = coachRepository.findByEmail(email);

        if (currentCoach == null) {
            throw new RuntimeException("Logged-in coach not found.");
        }

        // Assign coach to the team
        team.setCoaches(Collections.singletonList(currentCoach));

        return teamRepository.save(team);
    }


    //Update team details
    public Team updateTeam(Long id, Team updatedTeam) {
        Team existingTeam = getTeamById(id);
        if (existingTeam != null) {
            if (updatedTeam.getTeamName() != null) {
                existingTeam.setTeamName(updatedTeam.getTeamName());
            }
            if (updatedTeam.getAdmin() != null) {
                existingTeam.setAdmin(updatedTeam.getAdmin());
            }
            if (updatedTeam.getCoaches() != null) {
                existingTeam.setCoaches(updatedTeam.getCoaches());
            }
            if (updatedTeam.getPlayers() != null) {
                existingTeam.setPlayers(updatedTeam.getPlayers());
            }
            return teamRepository.save(existingTeam);
        }
        return null;
    }

    //Add a new player directly to the team
    public Player addPlayerToTeam(Long teamId, Player player) {
        Team team = getTeamById(teamId);
        if (team == null) {
            throw new RuntimeException("Team not found.");
        }

        player.setTeam(team);
        return playerRepository.save(player);
    }

    //Assign an existing player to the team
    public Player assignPlayerToTeam(Long teamId, Long playerId) {
        Team team = getTeamById(teamId);
        Player player = playerRepository.findById(playerId).orElse(null);

        if (team == null || player == null) {
            return null;
        }

        player.setTeam(team);
        return playerRepository.save(player);
    }

    //Delete a team
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    //Get all teams by admin ID
    public List<Team> getTeamsByAdminId(int adminId) {
        return teamRepository.findByAdmin_AdminId(adminId);
    }

    //Get all teams by coach ID
    public List<Team> getTeamsByCoachId(int coachId) {
        return teamRepository.findByCoaches_CoachId(coachId);
    }



    @Transactional
    public boolean removePlayerFromTeam(Long teamId, Long playerId) {
        Team team = getTeamById(teamId);
        Player player = playerRepository.findById(playerId).orElse(null);

        if (team == null || player == null || player.getTeam() == null || !player.getTeam().getTeamId().equals(teamId)) {
            return false;
        }

        // Remove player from team
        player.setTeam(null);
        playerRepository.save(player);

        // Delete all join requests for this player
        joinRequestService.deleteAllPlayerRequests(playerId);

        return true;
    }

    public Team addCoachToTeam(Long teamId, Integer coachId) {
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            throw new RuntimeException("Team not found");
        }

        // We need to inject CoachRepository for this
        Coach coach = coachRepository.findById(coachId).orElse(null);
        if (coach == null) {
            throw new RuntimeException("Coach not found");
        }

        // Add coach to team if not already in the list
        if (team.getCoaches() == null) {
            team.setCoaches(new ArrayList<>());
        }

        if (!team.getCoaches().contains(coach)) {
            team.getCoaches().add(coach);
            return teamRepository.save(team);
        }

        return team;
    }

}
package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.entity.Player;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.CoachRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeamService {


    private TeamRepository teamRepository;
    private PlayerRepository playerRepository;
    private CoachRepository coachRepository;

    @Autowired
    public TeamService(TeamRepository teamRepository, PlayerRepository playerRepository, CoachRepository coachRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.coachRepository = coachRepository;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id).orElse(null);
    }

    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    public Team updateTeam(Long id, Team updatedTeam) {
        Team existing = getTeamById(id);
        if (existing != null) {
            existing.setTeamName(updatedTeam.getTeamName());
            existing.setAdmin(updatedTeam.getAdmin());
            existing.setCoaches(updatedTeam.getCoaches());
            return teamRepository.save(existing);
        }
        return null;
    }


    public Player addPlayerToTeam(Long teamId, Player player) {
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            throw new RuntimeException("Team not found");
        }

        player.setTeam(team); // Assign the team
        return playerRepository.save(player); // Save player to DB
    }

    public Player assignPlayerToTeam(Long teamId, Long playerId) {
        Team team = teamRepository.findById(teamId).orElse(null);
        Player player = playerRepository.findById(playerId).orElse(null);

        if (team == null || player == null) {
            return null; // or throw exception
        }

        player.setTeam(team); // associate player to team
        return playerRepository.save(player);
    }


    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public List<Team> getTeamsByAdminId(int adminId) {
        return teamRepository.findByAdmin_AdminId(adminId);
    }

    public List<Team> getTeamsByCoachId(int coachId) {
        return teamRepository.findByCoaches_CoachId(coachId);
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


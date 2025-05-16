package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

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

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public List<Team> getTeamsByAdminId(int adminId) {
        return teamRepository.findByAdmin_AdminId(adminId);
    }

    public List<Team> getTeamsByCoachId(int coachId) {
        return teamRepository.findByCoaches_CoachId(coachId);
    }
}


package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {
    @Autowired
    private TeamRepository repo;

    public List<Team> getAll() {
        return repo.findAll();
    }

    public Team getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Team save(Team team) {
        return repo.save(team);
    }

    public Team update(Long id, Team team) {
        team.setTeamId(id);
        return repo.save(team);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

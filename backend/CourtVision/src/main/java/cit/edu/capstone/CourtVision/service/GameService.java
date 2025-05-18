package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.entity.Team;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import cit.edu.capstone.CourtVision.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {
    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private TeamRepository teamRepo;

    public List<Game> getAll() {
        return gameRepo.findAll();
    }

    public Game getById(Long id) {
        return gameRepo.findById(id).orElse(null);
    }

    public List<Game> getByTeamId(Long teamId) {
        Team team = teamRepo.findById(teamId).orElse(null);
        return team != null ? gameRepo.findByTeam(team) : null;
    }

    public Game save(Game game) {
        return gameRepo.save(game);
    }

    public Game update(Long id, Game updated) {
        updated.setGameId(id);
        return gameRepo.save(updated);
    }

    public void delete(Long id) {
        gameRepo.deleteById(id);
    }
}

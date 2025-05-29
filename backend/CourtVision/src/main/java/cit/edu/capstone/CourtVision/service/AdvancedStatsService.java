package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.dto.AdvancedStatsDTO;
import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.Game;
import cit.edu.capstone.CourtVision.repository.AdvancedStatsRepository;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import cit.edu.capstone.CourtVision.repository.GameRepository;
import cit.edu.capstone.CourtVision.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvancedStatsService {

    @Autowired
    private AdvancedStatsRepository repository;
    @Autowired private GameRepository gameRepo;
    @Autowired private PlayerRepository playerRepo;
    @Autowired private BasicStatsRepository basicStatsRepo;

    public List<AdvancedStats> getAll() {
        return repository.findAll();
    }

    public AdvancedStats getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public AdvancedStats create(AdvancedStats advancedStats) {
        return repository.save(advancedStats);
    }

    public AdvancedStats update(Long id, AdvancedStats advancedStats) {
        AdvancedStats existing = getById(id);
        if (existing != null) {
            advancedStats.setAdvancedStatsId(id);
            return repository.save(advancedStats);
        }
        return null;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Get by BasicStats ID
    public AdvancedStats getByBasicStatsId(Long basicStatsId) {
        BasicStats basic = basicStatsRepo.findById(basicStatsId).orElse(null);
        return basic != null ? repository.findByBasicStats(basic) : null;
    }

    // Get by Game ID
    public List<AdvancedStats> getByGame(Long gameId) {
        Game game = gameRepo.findById(gameId).orElse(null);
        return game != null ? repository.findByBasicStats_Game(game) : List.of();
    }
}

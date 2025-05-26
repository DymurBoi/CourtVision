package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.AdvancedStats;
import cit.edu.capstone.CourtVision.repository.AdvancedStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvancedStatsService {

    @Autowired
    private AdvancedStatsRepository repository;

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
            advancedStats.setId(id);
            return repository.save(advancedStats);
        }
        return null;
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

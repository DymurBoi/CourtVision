package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BasicStatsService {
    @Autowired
    private BasicStatsRepository repo;

    public List<BasicStats> getAll() {
        return repo.findAll();
    }

    public BasicStats getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public BasicStats save(BasicStats stat) {
        return repo.save(stat);
    }

    public BasicStats update(Long id, BasicStats updatedStat) {
        updatedStat.setBasicStatId(id);
        return repo.save(updatedStat);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BasicStatsService {

    @Autowired
    private BasicStatsRepository repository;

    public List<BasicStats> getAll() {
        return repository.findAll();
    }

    public BasicStats getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public BasicStats create(BasicStats stats) {
        return repository.save(stats);
    }

    public BasicStats update(Long id, BasicStats updated) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setTwoPtAttempts(updated.getTwoPtAttempts());
                    existing.setTwoPtMade(updated.getTwoPtMade());
                    existing.setThreePtAttempts(updated.getThreePtAttempts());
                    existing.setThreePtMade(updated.getThreePtMade());
                    existing.setFtAttempts(updated.getFtAttempts());
                    existing.setFtMade(updated.getFtMade());
                    existing.setAssists(updated.getAssists());
                    existing.setoFRebounds(updated.getoFRebounds());
                    existing.setdFRebounds(updated.getdFRebounds());
                    existing.setBlocks(updated.getBlocks());
                    existing.setSteals(updated.getSteals());
                    existing.setTurnovers(updated.getTurnovers());
                    existing.setpFouls(updated.getpFouls());
                    existing.setdFouls(updated.getdFouls());
                    existing.setPlusMinus(updated.getPlusMinus());
                    existing.setMinutes(updated.getMinutes());
                    return repository.save(existing);
                })
                .orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

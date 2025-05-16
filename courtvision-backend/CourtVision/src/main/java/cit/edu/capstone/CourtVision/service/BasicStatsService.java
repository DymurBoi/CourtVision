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
        stat.setPlusMinus(calculatePlusMinus(stat));
        return repo.save(stat);
    }

    public BasicStats update(Long id, BasicStats updatedStat) {
        updatedStat.setBasicStatId(id);
        updatedStat.setPlusMinus(calculatePlusMinus(updatedStat));
        return repo.save(updatedStat);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private int calculatePlusMinus(BasicStats stat) {
        int score = (stat.getTwoPtMade() * 2) + (stat.getThreePtMade() * 3) + stat.getFtMade();
        int impact = stat.getAssists() + stat.getBlocks() + stat.getSteals() + stat.getoFRebounds() + stat.getdFRebounds();
        int penalties = stat.getTurnovers() + stat.getpFouls() + stat.getdFouls();
        return score + impact - penalties;
    }
}

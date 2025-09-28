package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.*;
import cit.edu.capstone.CourtVision.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import cit.edu.capstone.CourtVision.mapper.BasicStatsVariationMapper;

@Service
public class BasicStatsVariationService {

    @Autowired
    private BasicStatsVariationRepository basicStatsRepository;

    public List<BasicStatsVariation> getAll() {
        return basicStatsRepository.findAll();
    }

    public BasicStatsVariation getById(Long id) {
        return basicStatsRepository.findById(id).orElse(null);
    }

    public BasicStatsVariation pointsConvert(BasicStatsVariation basicStats){
        int points = (basicStats.getTwoPtMade() * 2) + (basicStats.getThreePtMade() * 3) + basicStats.getFtMade();
        basicStats.setGamePoints(points);
        return basicStats;
    }
    public BasicStatsVariation create(BasicStatsVariation basicStats) {
        basicStats=pointsConvert(basicStats);

        // Save BasicStats first
        BasicStatsVariation savedBasic = basicStatsRepository.save(basicStats);
        return savedBasic;
    }


    public BasicStatsVariation update(Long id, BasicStatsVariation updatedStats) {
        BasicStatsVariation existing = getById(id);
        if (existing != null) {
            existing.setTwoPtAttempts(updatedStats.getTwoPtAttempts());
            existing.setTwoPtMade(updatedStats.getTwoPtMade());
            existing.setThreePtAttempts(updatedStats.getThreePtAttempts());
            existing.setThreePtMade(updatedStats.getThreePtMade());
            existing.setFtAttempts(updatedStats.getFtAttempts());
            existing.setFtMade(updatedStats.getFtMade());
            existing.setAssists(updatedStats.getAssists());
            existing.setoFRebounds(updatedStats.getoFRebounds());
            existing.setdFRebounds(updatedStats.getdFRebounds());
            existing.setBlocks(updatedStats.getBlocks());
            existing.setSteals(updatedStats.getSteals());
            existing.setTurnovers(updatedStats.getTurnovers());
            existing.setpFouls(updatedStats.getpFouls());
            existing.setdFouls(updatedStats.getdFouls());
            existing.setPlusMinus(updatedStats.getPlusMinus());
            existing.setMinutes(updatedStats.getMinutes());
            existing.setGamePoints(updatedStats.getGamePoints());

            if (updatedStats.getGame() != null) {
                existing.setGame(updatedStats.getGame());
            }
            // Save the updated BasicStats
            BasicStatsVariation savedBasic = basicStatsRepository.save(existing);
            return savedBasic;
        }
        return null;
    }

    public void delete(Long id) {
        BasicStatsVariation basic = getById(id);
        if (basic != null) {
            basicStatsRepository.deleteById(id);
        }
    }

    public List<BasicStatsDTO> getBasicStatsByGameId(Long gameId) {
        List<BasicStatsVariation> stats = basicStatsRepository.findByGame_GameId(gameId);
        return stats.stream()
                    .map(BasicStatsVariationMapper::toDTO)
                    .collect(Collectors.toList());
    }
}

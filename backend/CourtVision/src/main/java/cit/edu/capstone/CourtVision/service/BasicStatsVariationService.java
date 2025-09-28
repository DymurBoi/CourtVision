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
    private BasicStatsRepository basicStatsRepository;


    @Autowired
    private BasicStatsVariationRepository basicStatsVarRepository;

    public List<BasicStatsVariation> getAll() {
        return basicStatsVarRepository.findAll();
    }

    public BasicStatsVariation getById(Long id) {
        return basicStatsVarRepository.findById(id).orElse(null);
    }

    public BasicStatsVariation pointsConvert(BasicStatsVariation basicStats){
        int points = (basicStats.getTwoPtMade() * 2) + (basicStats.getThreePtMade() * 3) + basicStats.getFtMade();
        basicStats.setGamePoints(points);
        return basicStats;
    }
    public BasicStatsVariation create(BasicStatsVariation basicStats) {
    basicStats = pointsConvert(basicStats);
    BasicStatsVariation savedBasic = basicStatsVarRepository.save(basicStats);

    updateSubbedInPlusMinus(savedBasic);  // ← Add this line

    return savedBasic;
    }



    public BasicStatsVariation update(Long id, BasicStatsVariation updatedStats) {
    BasicStatsVariation existing = getById(id);
    if (existing != null) {
        int oldPoints = existing.getGamePoints();

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

        if (updatedStats.getGame() != null) {
            existing.setGame(updatedStats.getGame());
        }

        // Recalculate points
        existing = pointsConvert(existing);
        int newPoints = existing.getGamePoints();

        // Save the updated stats
        BasicStatsVariation savedBasic = basicStatsVarRepository.save(existing);

        // Adjust subbed-in players' plusMinus based on point delta
        updateSubbedInPlusMinus(savedBasic, newPoints - oldPoints);

        return savedBasic;
    }
    return null;
}


    public void delete(Long id) {
        BasicStatsVariation basic = getById(id);
        if (basic != null) {
            basicStatsVarRepository.deleteById(id);
        }
    }

    public List<BasicStatsDTO> getBasicStatsByGameId(Long gameId) {
        List<BasicStatsVariation> stats = basicStatsVarRepository.findByGame_GameId(gameId);
        return stats.stream()
                    .map(BasicStatsVariationMapper::toDTO)
                    .collect(Collectors.toList());
    }

    private void updateSubbedInPlusMinus(BasicStatsVariation variation) {
    updateSubbedInPlusMinus(variation, variation.getGamePoints());
}

    private void updateSubbedInPlusMinus(BasicStatsVariation variation, int pointDelta) {
        if (variation.getGame() == null || pointDelta == 0) return;

        List<BasicStats> subbedInPlayers = basicStatsRepository
                .findByGame_GameIdAndSubbedInTrue(variation.getGame().getGameId());

        for (BasicStats stats : subbedInPlayers) {
            stats.setPlusMinus(stats.getPlusMinus() + pointDelta);
        }

        basicStatsRepository.saveAll(subbedInPlayers);
    }

}

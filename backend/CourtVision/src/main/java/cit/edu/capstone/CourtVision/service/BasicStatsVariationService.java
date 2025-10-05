package cit.edu.capstone.CourtVision.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.edu.capstone.CourtVision.dto.BasicStatsDTO;
import cit.edu.capstone.CourtVision.entity.BasicStats;
import cit.edu.capstone.CourtVision.entity.BasicStatsVariation;
import cit.edu.capstone.CourtVision.mapper.BasicStatsVariationMapper;
import cit.edu.capstone.CourtVision.repository.BasicStatsRepository;
import cit.edu.capstone.CourtVision.repository.BasicStatsVariationRepository;

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
        System.out.println("New Game Points: "+basicStats.getGamePoints());
        return basicStats;
    }

    public BasicStatsVariation create(BasicStatsVariation basicStats) {
    basicStats = pointsConvert(basicStats);
    BasicStatsVariation savedBasic = basicStatsVarRepository.save(basicStats);

    updateSubbedInPlusMinus(savedBasic);  // ← Add this line

    return savedBasic;
    }

    public BasicStatsVariation differenceChecker(BasicStatsVariation temp, BasicStatsVariation updateStat){
        temp.setTwoPtMade(updateStat.getTwoPtMade()-temp.getTwoPtMade());
        System.out.println("Two: "+temp.getTwoPtMade());
        temp.setThreePtMade(updateStat.getThreePtMade()-temp.getThreePtMade());
        System.out.println("Three: "+temp.getThreePtMade());
        temp.setFtMade(updateStat.getFtMade()-temp.getFtMade());
        System.out.println("FT: "+temp.getFtMade());
        System.out.println("GamePts: "+temp.getGamePoints());
        temp=pointsConvert(temp);
        return temp;
    }

    public BasicStatsVariation update(Long id, BasicStatsVariation updatedStats) {
    BasicStatsVariation existing = getById(id);
    if (existing != null) {
        BasicStatsVariation tempStat=existing;
        tempStat=differenceChecker(tempStat,updatedStats);
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
        updateSubbedInPlusMinus(tempStat, tempStat.getGamePoints());
        // Recalculate points
        existing = pointsConvert(existing);

        // Save the updated stats
        BasicStatsVariation savedBasic = basicStatsVarRepository.save(existing);

        // Adjust subbed-in players' plusMinus based on point delta
        

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

   public List<BasicStatsVariation> getBasicStatsByGameId(Long gameId) {
    return basicStatsVarRepository.findByGame_GameId(gameId);
}


    private void updateSubbedInPlusMinus(BasicStatsVariation variation) {
        updateSubbedInPlusMinus(variation, variation.getGamePoints());
    }

    private void updateSubbedInPlusMinus(BasicStatsVariation variation, int pointDelta) {
        if (variation.getGame() == null || pointDelta == 0) return;

        // Get all subbed-in players for the game
        List<BasicStats> subbedInPlayers = basicStatsRepository
                .findByGame_GameIdAndSubbedInTrue(variation.getGame().getGameId());

        // Iterate through each subbed-in player
        for (BasicStats stats : subbedInPlayers) {
            // Calculate the point difference
            int previousPoints = stats.getPlusMinus();  // This is the previous gamePoints value
            int currentPoints = variation.getGamePoints();  // This is the updated gamePoints value

            // Calculate the point difference (delta)
            int pointDifference =  previousPoints-currentPoints;

            // Log the pointDifference for debugging
            System.out.println("Point Difference for player " + stats.getBasicStatId() + ": " + pointDifference);

            // Update the PlusMinus by subtracting the pointDifference from the current PlusMinus
            int newPlusMinus = pointDifference;
            stats.setPlusMinus(newPlusMinus);

            // Log the new PlusMinus value for debugging
            System.out.println("Updated PlusMinus for player " + stats.getBasicStatId() + ": " + newPlusMinus);
        }

        // Save all subbed-in players after the update
        basicStatsRepository.saveAll(subbedInPlayers);
    }

}

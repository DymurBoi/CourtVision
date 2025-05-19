package cit.edu.capstone.CourtVision.dto;

public class PlayerAveragesDTO {
    private Long playerAvgId;
    private PlayerDTO player;
    private GameDTO game;
    private double pointsPerGame;
    private double assistsPerGame;
    private double reboundsPerGame;
    private double stealsPerGame;
    private double blocksPerGame;
    private double minutesPerGame;
    private double trueShootingPercentage;
    private double usagePercentage;
    private double offensiveRating;
    private double defensiveRating;

    // Getters and Setters

    public Long getPlayerAvgId() {
        return playerAvgId;
    }

    public void setPlayerAvgId(Long playerAvgId) {
        this.playerAvgId = playerAvgId;
    }

    public PlayerDTO getPlayer() {
        return player;
    }

    public void setPlayer(PlayerDTO player) {
        this.player = player;
    }

    public GameDTO getGame() {
        return game;
    }

    public void setGame(GameDTO game) {
        this.game = game;
    }

    public double getPointsPerGame() {
        return pointsPerGame;
    }

    public void setPointsPerGame(double pointsPerGame) {
        this.pointsPerGame = pointsPerGame;
    }

    public double getAssistsPerGame() {
        return assistsPerGame;
    }

    public void setAssistsPerGame(double assistsPerGame) {
        this.assistsPerGame = assistsPerGame;
    }

    public double getReboundsPerGame() {
        return reboundsPerGame;
    }

    public void setReboundsPerGame(double reboundsPerGame) {
        this.reboundsPerGame = reboundsPerGame;
    }

    public double getStealsPerGame() {
        return stealsPerGame;
    }

    public void setStealsPerGame(double stealsPerGame) {
        this.stealsPerGame = stealsPerGame;
    }

    public double getBlocksPerGame() {
        return blocksPerGame;
    }

    public void setBlocksPerGame(double blocksPerGame) {
        this.blocksPerGame = blocksPerGame;
    }

    public double getMinutesPerGame() {
        return minutesPerGame;
    }

    public void setMinutesPerGame(double minutesPerGame) {
        this.minutesPerGame = minutesPerGame;
    }

    public double getTrueShootingPercentage() {
        return trueShootingPercentage;
    }

    public void setTrueShootingPercentage(double trueShootingPercentage) {
        this.trueShootingPercentage = trueShootingPercentage;
    }

    public double getUsagePercentage() {
        return usagePercentage;
    }

    public void setUsagePercentage(double usagePercentage) {
        this.usagePercentage = usagePercentage;
    }

    public double getOffensiveRating() {
        return offensiveRating;
    }

    public void setOffensiveRating(double offensiveRating) {
        this.offensiveRating = offensiveRating;
    }

    public double getDefensiveRating() {
        return defensiveRating;
    }

    public void setDefensiveRating(double defensiveRating) {
        this.defensiveRating = defensiveRating;
    }
}

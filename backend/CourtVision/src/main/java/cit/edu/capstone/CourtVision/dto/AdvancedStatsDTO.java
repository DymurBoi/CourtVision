package cit.edu.capstone.CourtVision.dto;

public class AdvancedStatsDTO {
    private Long advancedStatsId;
    private double uPER;
    private double eFG;
    private double ts;

    private double assistRatio;
    private double turnoverRatio;
    private double ftr;

    private double atRatio;
    private double ftPercentage;
    private double ortg;
    private double usgPercentage;
    private double pointsPerMinute;
    private double shootingEfficiency;
    private double pointsPerShot;

    private BasicStatsDTO basicStatsDTO;
    private GameDTO gameDTO;

    // Getters and Setters


    public double getAtRatio() {
        return atRatio;
    }

    public void setAtRatio(double atRatio) {
        this.atRatio = atRatio;
    }

    public double getFtPercentage() {
        return ftPercentage;
    }

    public void setFtPercentage(double ftPercentage) {
        this.ftPercentage = ftPercentage;
    }

    public double getUsgPercentage() {
        return usgPercentage;
    }

    public void setUsgPercentage(double usgPercentage) {
        this.usgPercentage = usgPercentage;
    }

    public double getPointsPerMinute() {
        return pointsPerMinute;
    }

    public void setPointsPerMinute(double pointsPerMinute) {
        this.pointsPerMinute = pointsPerMinute;
    }

    public double getShootingEfficiency() {
        return shootingEfficiency;
    }

    public void setShootingEfficiency(double shootingEfficiency) {
        this.shootingEfficiency = shootingEfficiency;
    }

    public double getPointsPerShot() {
        return pointsPerShot;
    }

    public void setPointsPerShot(double pointsPerShot) {
        this.pointsPerShot = pointsPerShot;
    }

    public Long getAdvancedStatsId() {
        return advancedStatsId;
    }

    public void setAdvancedStatsId(Long advancedStatsId) {
        this.advancedStatsId = advancedStatsId;
    }

    public GameDTO getGameDTO() {
        return gameDTO;
    }

    public void setGameDTO(GameDTO gameDTO) {
        this.gameDTO = gameDTO;
    }

    public BasicStatsDTO getBasicStatsDTO() {
        return basicStatsDTO;
    }

    public void setBasicStatsDTO(BasicStatsDTO basicStatsDTO) {
        this.basicStatsDTO = basicStatsDTO;
    }


    public double getuPER() {
        return uPER;
    }

    public void setuPER(double uPER) {
        this.uPER = uPER;
    }

    public double geteFG() {
        return eFG;
    }

    public void seteFG(double eFG) {
        this.eFG = eFG;
    }

    public double getTs() {
        return ts;
    }

    public void setTs(double ts) {
        this.ts = ts;
    }
    

    public double getAssistRatio() {
        return assistRatio;
    }

    public void setAssistRatio(double assistRatio) {
        this.assistRatio = assistRatio;
    }

    public double getTurnoverRatio() {
        return turnoverRatio;
    }

    public void setTurnoverRatio(double turnoverRatio) {
        this.turnoverRatio = turnoverRatio;
    }



    public double getOrtg() {
        return ortg;
    }

    public void setOrtg(double ortg) {
        this.ortg = ortg;
    }

    public double getFtr() {
        return ftr;
    }

    public void setFtr(double ftr) {
        this.ftr = ftr;
    }
}


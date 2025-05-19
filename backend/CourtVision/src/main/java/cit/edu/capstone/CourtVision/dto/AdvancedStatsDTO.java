package cit.edu.capstone.CourtVision.dto;

public class AdvancedStatsDTO {
    private Long id;
    private double uPER;
    private double eFG;
    private double ts;
    private double usg;
    private double assistRatio;
    private double turnoverRatio;
    private double pie;
    private double ortg;
    private double drtg;
    private double rebPercentage;
    private double orbPercentage;
    private double drbPercentage;
    private double astPercentage;
    private double stlPercentage;
    private double blkPercentage;
    private double tovPercentage;
    private double ftr;

    private BasicStatsDTO basicStatsDTO;
    private GameDTO gameDTO;

    // Getters and Setters


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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public double getUsg() {
        return usg;
    }

    public void setUsg(double usg) {
        this.usg = usg;
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

    public double getPie() {
        return pie;
    }

    public void setPie(double pie) {
        this.pie = pie;
    }

    public double getOrtg() {
        return ortg;
    }

    public void setOrtg(double ortg) {
        this.ortg = ortg;
    }

    public double getDrtg() {
        return drtg;
    }

    public void setDrtg(double drtg) {
        this.drtg = drtg;
    }

    public double getRebPercentage() {
        return rebPercentage;
    }

    public void setRebPercentage(double rebPercentage) {
        this.rebPercentage = rebPercentage;
    }

    public double getOrbPercentage() {
        return orbPercentage;
    }

    public void setOrbPercentage(double orbPercentage) {
        this.orbPercentage = orbPercentage;
    }

    public double getDrbPercentage() {
        return drbPercentage;
    }

    public void setDrbPercentage(double drbPercentage) {
        this.drbPercentage = drbPercentage;
    }

    public double getAstPercentage() {
        return astPercentage;
    }

    public void setAstPercentage(double astPercentage) {
        this.astPercentage = astPercentage;
    }

    public double getStlPercentage() {
        return stlPercentage;
    }

    public void setStlPercentage(double stlPercentage) {
        this.stlPercentage = stlPercentage;
    }

    public double getBlkPercentage() {
        return blkPercentage;
    }

    public void setBlkPercentage(double blkPercentage) {
        this.blkPercentage = blkPercentage;
    }

    public double getTovPercentage() {
        return tovPercentage;
    }

    public void setTovPercentage(double tovPercentage) {
        this.tovPercentage = tovPercentage;
    }

    public double getFtr() {
        return ftr;
    }

    public void setFtr(double ftr) {
        this.ftr = ftr;
    }
}


package cit.edu.capstone.CourtVision.dto;

import java.sql.Time;

public class BasicStatsDTO {
    private Long basicStatId;
    private int twoPtAttempts;
    private int twoPtMade;
    private int threePtAttempts;
    private int threePtMade;
    private int ftAttempts;
    private int ftMade;
    private int assists;
    private int oFRebounds;
    private int dFRebounds;
    private int blocks;
    private int steals;
    private int turnovers;
    private int pFouls;
    private int dFouls;
    private int plusMinus;
    private Time minutes;

    private AdvancedStatsDTO advancedStatsDTO;
    private PhysicalBasedMetricsStatsDTO physicalBasedMetricsStatsDTO;
    private GameDTO gameDTO;


    // Getters and Setters


    public AdvancedStatsDTO getAdvancedStatsDTO() {
        return advancedStatsDTO;
    }

    public void setAdvancedStatsDTO(AdvancedStatsDTO advancedStatsDTO) {
        this.advancedStatsDTO = advancedStatsDTO;
    }

    public PhysicalBasedMetricsStatsDTO getPhysicalBasedMetricsStatsDTO() {
        return physicalBasedMetricsStatsDTO;
    }

    public void setPhysicalBasedMetricsStatsDTO(PhysicalBasedMetricsStatsDTO physicalBasedMetricsStatsDTO) {
        this.physicalBasedMetricsStatsDTO = physicalBasedMetricsStatsDTO;
    }

    public GameDTO getGameDTO() {
        return gameDTO;
    }

    public void setGameDTO(GameDTO gameDTO) {
        this.gameDTO = gameDTO;
    }

    public Long getBasicStatId() {
        return basicStatId;
    }

    public void setBasicStatId(Long basicStatId) {
        this.basicStatId = basicStatId;
    }

    public int getTwoPtAttempts() {
        return twoPtAttempts;
    }

    public void setTwoPtAttempts(int twoPtAttempts) {
        this.twoPtAttempts = twoPtAttempts;
    }

    public int getTwoPtMade() {
        return twoPtMade;
    }

    public void setTwoPtMade(int twoPtMade) {
        this.twoPtMade = twoPtMade;
    }

    public int getThreePtAttempts() {
        return threePtAttempts;
    }

    public void setThreePtAttempts(int threePtAttempts) {
        this.threePtAttempts = threePtAttempts;
    }

    public int getThreePtMade() {
        return threePtMade;
    }

    public void setThreePtMade(int threePtMade) {
        this.threePtMade = threePtMade;
    }

    public int getFtAttempts() {
        return ftAttempts;
    }

    public void setFtAttempts(int ftAttempts) {
        this.ftAttempts = ftAttempts;
    }

    public int getFtMade() {
        return ftMade;
    }

    public void setFtMade(int ftMade) {
        this.ftMade = ftMade;
    }

    public int getAssists() {
        return assists;
    }

    public void setAssists(int assists) {
        this.assists = assists;
    }

    public int getoFRebounds() {
        return oFRebounds;
    }

    public void setoFRebounds(int oFRebounds) {
        this.oFRebounds = oFRebounds;
    }

    public int getdFRebounds() {
        return dFRebounds;
    }

    public void setdFRebounds(int dFRebounds) {
        this.dFRebounds = dFRebounds;
    }

    public int getBlocks() {
        return blocks;
    }

    public void setBlocks(int blocks) {
        this.blocks = blocks;
    }

    public int getSteals() {
        return steals;
    }

    public void setSteals(int steals) {
        this.steals = steals;
    }

    public int getTurnovers() {
        return turnovers;
    }

    public void setTurnovers(int turnovers) {
        this.turnovers = turnovers;
    }

    public int getpFouls() {
        return pFouls;
    }

    public void setpFouls(int pFouls) {
        this.pFouls = pFouls;
    }

    public int getdFouls() {
        return dFouls;
    }

    public void setdFouls(int dFouls) {
        this.dFouls = dFouls;
    }

    public int getPlusMinus() {
        return plusMinus;
    }

    public void setPlusMinus(int plusMinus) {
        this.plusMinus = plusMinus;
    }

    public Time getMinutes() {
        return minutes;
    }

    public void setMinutes(Time minutes) {
        this.minutes = minutes;
    }
}
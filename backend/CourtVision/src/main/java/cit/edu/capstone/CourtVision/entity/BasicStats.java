package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "basic_stats",
    uniqueConstraints = @UniqueConstraint(columnNames = {"player_id", "game_id"}))
public class BasicStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long basicStatId;
//try pushing

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
    private int gamePoints;
    private boolean opponent = false;
    private boolean subbedIn = false;

    @Transient
    private long lastCheckInMillis; // timestamp when player was last subbed in

    //Relationship
    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "player_avg_id")
    private PlayerAverages playerAverages;


    @ManyToOne
    @JoinColumn(name = "season_id")
    private Season season;



    //Getter

    public BasicStats(BasicStats basicStats) {
    this.twoPtMade = basicStats.getTwoPtMade();
    this.threePtMade = basicStats.getThreePtMade();
    this.ftMade = basicStats.getFtMade();
    this.gamePoints = basicStats.getGamePoints();
    this.game = basicStats.getGame();
    this.player = basicStats.getPlayer();
    this.basicStatId = basicStats.getBasicStatId();
    this.subbedIn = basicStats.isSubbedIn();
    this.plusMinus = basicStats.getPlusMinus();

    }

    public int getGamePoints() {
        return gamePoints;
    }
    public void setGamePoints(int gamePoints) {
        this.gamePoints = gamePoints;
    }

    public PlayerAverages getPlayerAverages() {
        return playerAverages;
    }
    
    public void setPlayerAverages(PlayerAverages playerAverages) {
        this.playerAverages = playerAverages;
    }


    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Long getBasicStatId() {
        return basicStatId;
    }

    public void setBasicStatId(Long basicStatId) {
        this.basicStatId = basicStatId;
    }

    public int getTwoPtMade() {
        return twoPtMade;
    }

    public void setTwoPtMade(int twoPtMade) {
        this.twoPtMade = twoPtMade;
    }

    public int getTwoPtAttempts() {
        return twoPtAttempts;
    }

    public void setTwoPtAttempts(int twoPtAttempts) {
        this.twoPtAttempts = twoPtAttempts;
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

    public int getAssists() {
        return assists;
    }

    public void setAssists(int assists) {
        this.assists = assists;
    }

    public int getFtMade() {
        return ftMade;
    }

    public void setFtMade(int ftMade) {
        this.ftMade = ftMade;
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

    public int getdFouls() {
        return dFouls;
    }

    public void setdFouls(int dFouls) {
        this.dFouls = dFouls;
    }

    public int getpFouls() {
        return pFouls;
    }

    public void setpFouls(int pFouls) {
        this.pFouls = pFouls;
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

    public boolean isSubbedIn() {
    return subbedIn;
}

    public void setSubbedIn(boolean subbedIn) {
        this.subbedIn = subbedIn;
    }
public Season getSeason() {
        return season;
    }

    public void setSeason(Season season) {
        this.season = season;
}

    public boolean isOpponent() {
        return opponent;
    }

    public void setOpponent(boolean opponent) {
        this.opponent = opponent;
    }
}
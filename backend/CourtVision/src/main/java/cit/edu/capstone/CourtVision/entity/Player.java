package cit.edu.capstone.CourtVision.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "player")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playerId;

    private String fname;
    private String lname;
    private String email;
    private String password;
    private LocalDate birthDate;
    private int jerseyNum;
    private String position;
    private boolean isCoach;
    private boolean isAdmin;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToOne(mappedBy = "player", cascade = CascadeType.ALL)
    @JsonIgnore
    private PhysicalRecords physicalRecords;

    @OneToMany(mappedBy = "player") // One Player → Many PlayerAverages
    @JsonIgnore
    private List<PlayerAverages> playerAverages;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BasicStats> basicStatsList;

    // Getters and Setters


    public List<BasicStats> getBasicStatsList() {
        return basicStatsList;
    }

    public void setBasicStatsList(List<BasicStats> basicStatsList) {
        this.basicStatsList = basicStatsList;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public List<PlayerAverages> getPlayerAverages() {
        return playerAverages;
    }

    public void setPlayerAverages(List<PlayerAverages> playerAverages) {
        this.playerAverages = playerAverages;
    }

    public PhysicalRecords getPhysicalRecords() {
        return physicalRecords;
    }

    public void setPhysicalRecords(PhysicalRecords physicalRecords) {
        this.physicalRecords = physicalRecords;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public boolean isCoach() {
        return isCoach;
    }

    public void setCoach(boolean coach) {
        isCoach = coach;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getJerseyNum() {
        return jerseyNum;
    }

    public void setJerseyNum(int jerseyNum) {
        this.jerseyNum = jerseyNum;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public boolean getIsCoach() {
        return isCoach;
    }

    public void setIsCoach(boolean coach) {
        isCoach = coach;
    }

    public boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(boolean admin) {
        isAdmin = admin;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}

package cit.edu.capstone.CourtVision.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="player")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer playerId;
    private String fname;
    private String lname;
    private String email;
    private String password;
    private LocalDate birthDate;
    private int jerseyNum;
    private boolean isCoach;
    private boolean isAdmin;

    public Integer getPlayerId() {
        return playerId;
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

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public int getJerseyNum() {
        return jerseyNum;
    }

    public void setJerseyNum(int jerseyNum) {
        this.jerseyNum = jerseyNum;
    }

    public boolean getIsCoach() {
        return isCoach;
    }
    
    public void setIsCoach(boolean isCoach) {
        this.isCoach = isCoach;
    }

    public boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
    
}
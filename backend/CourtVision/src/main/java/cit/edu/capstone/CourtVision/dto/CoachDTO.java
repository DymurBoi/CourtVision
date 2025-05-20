package cit.edu.capstone.CourtVision.dto;

import java.time.LocalDate;
import java.util.List;

public class CoachDTO {
    private String fname;
    private String lname;
    private String email;
    private String password;
    private LocalDate birthDate;
    private List<TeamDTO> teams;

    // Getters and Setters

    public List<TeamDTO> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamDTO> teams) {
        this.teams = teams;
    }

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
}

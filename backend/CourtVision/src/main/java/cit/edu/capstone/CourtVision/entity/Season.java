package cit.edu.capstone.CourtVision.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Season {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seasonName; // e.g. "2025 Season", "Summer League"
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active; // true if ongoing

    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Team team;

    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL)
    private List<BasicStats> basicStats;

    @OneToMany(mappedBy = "season")
    @JsonIgnore
    private List<Game> games;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSeasonName() { return seasonName; }
    public void setSeasonName(String seasonName) { this.seasonName = seasonName; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }

    public List<BasicStats> getBasicStats() { return basicStats; }
    public void setBasicStats(List<BasicStats> basicStats) { this.basicStats = basicStats; }

    public List<Game> getGames() { return games; }
    public void setGames(List<Game> games) { this.games = games; }
}


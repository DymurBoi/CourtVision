package cit.edu.capstone.CourtVision.dto;

import java.time.LocalDateTime;

public class PlayByPlayDTO {

    private Long id;
    private Long gameId;
    private Long playerId;
    private String message;
    private LocalDateTime timestamp;

    // Constructor
    public PlayByPlayDTO(Long id, Long gameId, Long playerId, String message, LocalDateTime timestamp) {
        this.id = id;
        this.gameId = gameId;
        this.playerId = playerId;
        this.message = message;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

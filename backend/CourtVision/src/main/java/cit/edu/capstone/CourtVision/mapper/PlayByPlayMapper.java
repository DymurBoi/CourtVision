package cit.edu.capstone.CourtVision.mapper;

import org.springframework.stereotype.Component;

import cit.edu.capstone.CourtVision.entity.PlayByPlay;
import cit.edu.capstone.CourtVision.dto.PlayByPlayDTO;

@Component
public class PlayByPlayMapper {

    // Convert entity to DTO
    public PlayByPlayDTO toDTO(PlayByPlay playByPlay) {
        return new PlayByPlayDTO(
            playByPlay.getId(),
            playByPlay.getGameId(),
            playByPlay.getPlayerId(),
            playByPlay.getMessage(),
            playByPlay.getTimestamp()
        );
    }

    // Convert DTO to entity
    public PlayByPlay toEntity(PlayByPlayDTO playByPlayDTO) {
        PlayByPlay playByPlay = new PlayByPlay();
        playByPlay.setId(playByPlayDTO.getId());
        playByPlay.setGameId(playByPlayDTO.getGameId());
        playByPlay.setPlayerId(playByPlayDTO.getPlayerId());
        playByPlay.setMessage(playByPlayDTO.getMessage());
        playByPlay.setTimestamp(playByPlayDTO.getTimestamp());
        return playByPlay;
    }
}


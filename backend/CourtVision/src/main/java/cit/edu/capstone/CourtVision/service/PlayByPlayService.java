package cit.edu.capstone.CourtVision.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.edu.capstone.CourtVision.entity.PlayByPlay;
import cit.edu.capstone.CourtVision.dto.PlayByPlayDTO;
import cit.edu.capstone.CourtVision.mapper.PlayByPlayMapper;
import cit.edu.capstone.CourtVision.repository.PlayByPlayRepository;

@Service
public class PlayByPlayService {

    @Autowired
    private PlayByPlayRepository playByPlayRepository;

    @Autowired
    private PlayByPlayMapper playByPlayMapper;

    // Save a new play-by-play record
    public PlayByPlayDTO savePlayByPlay(PlayByPlayDTO playByPlayDTO) {
        PlayByPlay playByPlay = playByPlayMapper.toEntity(playByPlayDTO);
        playByPlay.setTimestamp(LocalDateTime.now());  // Set current timestamp
        PlayByPlay savedPlay = playByPlayRepository.save(playByPlay);
        return playByPlayMapper.toDTO(savedPlay);
    }

    // Get all play-by-play records for a specific game
    public List<PlayByPlayDTO> getPlayByPlaysByGame(Long gameId) {
        List<PlayByPlay> playByPlays = playByPlayRepository.findByGameId(gameId);
        return playByPlays.stream()
                .map(playByPlayMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get all play-by-play records for a specific player
    public List<PlayByPlayDTO> getPlayByPlaysByPlayer(Long playerId) {
        List<PlayByPlay> playByPlays = playByPlayRepository.findByPlayerId(playerId);
        return playByPlays.stream()
                .map(playByPlayMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get all play-by-play records for a specific player in a specific game
    public List<PlayByPlayDTO> getPlayByPlaysByGameAndPlayer(Long gameId, Long playerId) {
        List<PlayByPlay> playByPlays = playByPlayRepository.findByGameIdAndPlayerId(gameId, playerId);
        return playByPlays.stream()
                .map(playByPlayMapper::toDTO)
                .collect(Collectors.toList());
    }
}

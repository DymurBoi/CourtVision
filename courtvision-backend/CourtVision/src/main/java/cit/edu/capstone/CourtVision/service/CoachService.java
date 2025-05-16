package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.dto.CoachDTO;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.repository.CoachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoachService {

    @Autowired
    private CoachRepository coachRepository;

    public List<Coach> getAllCoaches() {
        return coachRepository.findAll();
    }

    public Coach getCoachById(Integer id) {
        return coachRepository.findById(id).orElse(null);
    }

    public Coach createCoach(Coach coach) {
        coach.setIsCoach(true);
        coach.setIsAdmin(false);
        return coachRepository.save(coach);
    }

    public Coach updateCoach(Integer id, CoachDTO dto) {
    Coach coach = getCoachById(id);
    if (coach != null) {
        if (dto.getFname() != null) coach.setFname(dto.getFname());
        if (dto.getLname() != null) coach.setLname(dto.getLname());
        if (dto.getEmail() != null) coach.setEmail(dto.getEmail());
        if (dto.getPassword() != null) coach.setPassword(dto.getPassword());
        if (dto.getBirthDate() != null) coach.setBirthDate(dto.getBirthDate());

        return coachRepository.save(coach);
    }
    return null;
}


    public void deleteCoach(Integer id) {
        coachRepository.deleteById(id);
    }

    public List<Coach> getCoachesByTeamId(Long teamId) {
        return coachRepository.findByTeams_TeamId(teamId);
    }
}


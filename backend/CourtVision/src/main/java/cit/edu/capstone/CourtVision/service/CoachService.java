package cit.edu.capstone.CourtVision.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import cit.edu.capstone.CourtVision.dto.CoachDTO;
import cit.edu.capstone.CourtVision.entity.Coach;
import cit.edu.capstone.CourtVision.repository.CoachRepository;

@Service
public class CoachService {

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Coach> getAllCoaches() {
        return coachRepository.findAll();
    }

    public Coach getCoachById(Integer id) {
        return coachRepository.findById(id).orElse(null);
    }

    public Coach createCoach(Coach coach) {
        coach.setIsCoach(true);
        coach.setIsAdmin(false);
        coach.setPassword(passwordEncoder.encode(coach.getPassword()));
        return coachRepository.save(coach);
    }

    public Coach updateCoach(Integer id, CoachDTO coachDTO) {
        Coach coach = getCoachById(id);
        if (coach != null) {
            if (coachDTO.getFname() != null) coach.setFname(coachDTO.getFname());
            if (coachDTO.getLname() != null) coach.setLname(coachDTO.getLname());
            if (coachDTO.getEmail() != null) coach.setEmail(coachDTO.getEmail());
            // Only encode if password is being updated
            if (coachDTO.getPassword() != null && !coachDTO.getPassword().isEmpty()) {
                coach.setPassword(passwordEncoder.encode(coachDTO.getPassword()));
            }
            if (coachDTO.getBirthDate() != null) coach.setBirthDate(coachDTO.getBirthDate());

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


package cit.edu.capstone.CourtVision.service;

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
        return coachRepository.save(coach);
    }

    public Coach updateCoach(Integer id, Coach updatedCoach) {
        Coach coach = getCoachById(id);
        if (coach != null) {
            coach.setFname(updatedCoach.getFname());
            coach.setLname(updatedCoach.getLname());
            coach.setEmail(updatedCoach.getEmail());
            coach.setPassword(updatedCoach.getPassword());
            coach.setBirthDate(updatedCoach.getBirthDate());
            coach.setIsCoach(updatedCoach.getIsCoach());
            coach.setIsAdmin(updatedCoach.getIsAdmin());
            coach.setTeams(updatedCoach.getTeams());
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


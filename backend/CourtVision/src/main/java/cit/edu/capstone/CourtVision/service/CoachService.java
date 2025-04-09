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
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Coach> getAllCoaches() {
        return coachRepository.findAll();
    }

    public Optional<Coach> getCoachById(Integer id) {
        return coachRepository.findById(id);
    }

    public Coach createCoach(Coach coach) {
        coach.setPassword(passwordEncoder.encode(coach.getPassword()));
        return coachRepository.save(coach);
    }

    public Coach updateCoach(Integer id, Coach updatedCoach) {
        return coachRepository.findById(id).map(coach -> {
            coach.setFname(updatedCoach.getFname());
            coach.setLname(updatedCoach.getLname());
            coach.setEmail(updatedCoach.getEmail());

            // Only re-encode if password has changed
            if (!updatedCoach.getPassword().equals(coach.getPassword())) {
                coach.setPassword(passwordEncoder.encode(updatedCoach.getPassword()));
            }

            coach.setBirthDate(updatedCoach.getBirthDate());
            coach.setCoach(updatedCoach.isCoach());
            coach.setAdmin(updatedCoach.isAdmin());
            return coachRepository.save(coach);
        }).orElse(null);
    }

    public void deleteCoach(Integer id) {
        coachRepository.deleteById(id);
    }

    public Coach login(String email, String password) {
        return coachRepository.findByEmail(email)
                .filter(coach -> passwordEncoder.matches(password, coach.getPassword()))
                .orElse(null);
    }
}

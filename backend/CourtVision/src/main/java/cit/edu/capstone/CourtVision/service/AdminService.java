package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Admin;
import cit.edu.capstone.CourtVision.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Admin> getAll() { return adminRepo.findAll(); }

    public Admin getById(Long id) { return adminRepo.findById(id).orElse(null); }

    public Admin create(Admin admin) {
        admin.setRole("ADMIN");
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepo.save(admin);
    }

    public Admin update(Long id, Admin admin) {
        Admin existing = getById(id);
        if (existing != null) {
            existing.setEmail(admin.getEmail());
            // Only encode if password is being updated
            if (admin.getPassword() != null && !admin.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(admin.getPassword()));
            }
            return adminRepo.save(existing);
        }
        return null;
    }

    public void delete(Long id) { adminRepo.deleteById(id); }
}


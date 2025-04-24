package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.Admin;
import cit.edu.capstone.CourtVision.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired private AdminRepository adminRepo;

    public List<Admin> getAll() { return adminRepo.findAll(); }
    public Admin getById(int id) { return adminRepo.findById(id).orElse(null); }
    public Admin create(Admin admin) { return adminRepo.save(admin); }
    public Admin update(int id, Admin admin) {
        Admin existing = getById(id);
        if (existing != null) {
            existing.setEmail(admin.getEmail());
            existing.setPassword(admin.getPassword());
            existing.setIsCoach(admin.isCoach());
            existing.setIsAdmin(admin.isAdmin());
            return adminRepo.save(existing);
        }
        return null;
    }
    public void delete(int id) { adminRepo.deleteById(id); }
}


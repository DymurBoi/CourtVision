package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.AdminEntity;
import cit.edu.capstone.CourtVision.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public AdminEntity registerAdmin(AdminEntity admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Optional<AdminEntity> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Override
    public List<AdminEntity> getAllAdmins() {
        return adminRepository.findAll();
    }
}

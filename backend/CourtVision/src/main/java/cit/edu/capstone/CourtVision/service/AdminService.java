package cit.edu.capstone.CourtVision.service;

import cit.edu.capstone.CourtVision.entity.AdminEntity;

import java.util.List;
import java.util.Optional;

public interface AdminService {
    AdminEntity registerAdmin(AdminEntity admin);
    Optional<AdminEntity> getAdminByEmail(String email);
    List<AdminEntity> getAllAdmins();
}

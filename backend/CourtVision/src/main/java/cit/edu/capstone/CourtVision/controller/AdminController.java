package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.AdminEntity;
import cit.edu.capstone.CourtVision.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<AdminEntity> register(@RequestBody AdminEntity admin) {
        AdminEntity createdAdmin = adminService.registerAdmin(admin);
        return ResponseEntity.ok(createdAdmin);
    }

    @GetMapping("/{email}")
    public ResponseEntity<AdminEntity> getAdminByEmail(@PathVariable String email) {
        return adminService.getAdminByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<AdminEntity> getAllAdmins() {
        return adminService.getAllAdmins();
    }
}

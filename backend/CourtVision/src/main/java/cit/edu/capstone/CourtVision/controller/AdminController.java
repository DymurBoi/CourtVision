package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.Admin;
import cit.edu.capstone.CourtVision.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/admins")
public class AdminController {
    @Autowired private AdminService service;

    @GetMapping("/get/all")
    public List<Admin> getAll() {
        return service.getAll();
    }

    @GetMapping("/get/{id}")
    public Admin getById(@PathVariable Long id) {
        return service.getById(id);
    }
    
    @PostMapping ("/post")
    public Admin create(@RequestBody Admin admin) {
        return service.create(admin);
    }

    @PutMapping("/put/{id}")
    public Admin update(@PathVariable Long id, @RequestBody Admin a) {
        return service.update(id, a);
    }
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

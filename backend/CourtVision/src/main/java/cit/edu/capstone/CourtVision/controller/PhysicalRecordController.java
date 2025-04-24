package cit.edu.capstone.CourtVision.controller;

import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.service.PhysicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/physical-records")
public class PhysicalRecordController {

    @Autowired
    private PhysicalRecordService service;

    @GetMapping("/get/all")
    public List<PhysicalRecords> getAll() {
        return service.getAll();
    }

    @GetMapping("/get/{id}")
    public PhysicalRecords getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/get/by-player/{playerId}")
    public PhysicalRecords getByPlayerId(@PathVariable int playerId) {
        return service.getByPlayerId(playerId);
    }

    @PostMapping("/post")
    public PhysicalRecords create(@RequestBody PhysicalRecords record) {
        return service.save(record);
    }

    @PutMapping("/put/{id}")
    public PhysicalRecords update(@PathVariable Long id, @RequestBody PhysicalRecords record) {
        return service.update(id, record);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}


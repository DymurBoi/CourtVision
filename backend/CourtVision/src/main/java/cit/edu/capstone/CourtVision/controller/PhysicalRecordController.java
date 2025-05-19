package cit.edu.capstone.CourtVision.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cit.edu.capstone.CourtVision.dto.PhysicalRecordDTO;
import cit.edu.capstone.CourtVision.mapper.PlayerMapper;
import cit.edu.capstone.CourtVision.entity.PhysicalRecords;
import cit.edu.capstone.CourtVision.service.PhysicalRecordService;

@RestController
@RequestMapping("/api/physical-records")
public class PhysicalRecordController {

    @Autowired
    private PhysicalRecordService service;

    @GetMapping("/get/all")
public ResponseEntity<List<PhysicalRecordDTO>> getAll() {
    List<PhysicalRecords> records = service.getAll();
    List<PhysicalRecordDTO> dtos = records.stream()
                                          .map(PlayerMapper::toDto)
                                          .toList();
    return ResponseEntity.ok(dtos);
}

@GetMapping("/get/{id}")
public ResponseEntity<PhysicalRecordDTO> getById(@PathVariable Long id) {
    PhysicalRecords record = service.getById(id);
    if (record == null) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(PlayerMapper.toDto(record));
}

@GetMapping("/get/by-player/{playerId}")
public ResponseEntity<PhysicalRecordDTO> getByPlayerId(@PathVariable Long playerId) {
    PhysicalRecords record = service.getByPlayerId(playerId);
    if (record == null) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(PlayerMapper.toDto(record));
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


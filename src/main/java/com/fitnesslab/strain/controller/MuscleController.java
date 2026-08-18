package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.entity.Muscle;
import com.fitnesslab.strain.repository.MuscleRepository;
import com.fitnesslab.strain.service.MuscleService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MuscleController {
    private final MuscleService muscleService;

    @GetMapping("/muscles")
    public ResponseEntity<List<Muscle>> getMuscles(){
        return ResponseEntity.ok(muscleService.getAll());
    }

    @PostMapping("/muscles")
    public ResponseEntity<Muscle> addMuscle(@RequestBody Muscle muscle){
        Muscle savedMuscle = muscleService.create(muscle);
        return ResponseEntity.status(201).body(savedMuscle);
    }

    @DeleteMapping("/muscles/{id}")
    public ResponseEntity<Void> deleteMuscle(@PathVariable UUID id){
        muscleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
//
//    @DeleteMapping
//    public ResponseEntity<String> deleteMuscle(){
//
//    }

}

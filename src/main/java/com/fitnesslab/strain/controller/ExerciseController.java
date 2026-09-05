package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.entity.Exercise;
import com.fitnesslab.strain.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseService exerciseService;

    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getExercises(){
        return ResponseEntity.ok(exerciseService.getAll());
    }

    @PostMapping("/exercises")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise){
        Exercise savedExercise = exerciseService.create(exercise);
        return ResponseEntity.status(201).body(savedExercise);
    }
}

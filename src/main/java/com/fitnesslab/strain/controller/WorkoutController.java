package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.model.entity.Workout;
import com.fitnesslab.strain.service.UserService;
import com.fitnesslab.strain.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class WorkoutController {
    private final WorkoutService workoutService;
    private final UserService userService;

    @PostMapping("/workouts")
    public ResponseEntity<Workout> addWorkout(@RequestBody Workout workout, Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        Workout createdWorkout = workoutService.create(user.getId(), workout);
        return ResponseEntity.status(201).body(createdWorkout);
    }

    @GetMapping("/workouts/{workoutId}")
    public ResponseEntity<Workout> getWorkout(@PathVariable UUID workoutId){
        Workout workout = workoutService.findById(workoutId);
        return ResponseEntity.ok(workout);
    }

    @DeleteMapping("/workouts/{workoutId}")
    public ResponseEntity<Workout> deleteWorkout(@PathVariable UUID workoutId){
        workoutService.delete(workoutId);
        return ResponseEntity.noContent().build();
    }
}

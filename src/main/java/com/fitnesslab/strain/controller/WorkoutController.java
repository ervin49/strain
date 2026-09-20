package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.model.entity.Workout;
import com.fitnesslab.strain.service.UserService;
import com.fitnesslab.strain.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

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
}

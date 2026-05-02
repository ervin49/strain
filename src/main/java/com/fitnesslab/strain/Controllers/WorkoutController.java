package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.Models.Workout;
import com.fitnesslab.strain.Repositories.UserRepository;
import com.fitnesslab.strain.Services.UserService;
import com.fitnesslab.strain.Services.WorkoutService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Controller
public class WorkoutController {
    private final UserRepository userRepository;
    private final UserService userService;
    private final WorkoutService workoutService;

    @PostMapping("/users/{userId}/workouts")
    public ResponseEntity<String> addWorkout(@PathVariable UUID userId, @RequestBody Workout workout){
        workoutService.addWorkout(userId,workout);
        return new ResponseEntity<>("Success",HttpStatus.OK);
    }

    @PostMapping("/workouts")
    public ResponseEntity<String> addWorkout(@RequestBody Workout workout, Principal principal){
        String email = principal.getName();
        UUID userId = userService.getUserByEmail(email).getId();
        workoutService.addWorkout(userId,workout);
        return new ResponseEntity<>("Success",HttpStatus.OK);
    }

    @GetMapping("/users/{userId}/workouts")
    public ResponseEntity<List<Workout>> getWorkouts(@PathVariable UUID userId){
        List<Workout> workouts = workoutService.getWorkoutsByUserId(userId);
        if(workouts.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(workouts, HttpStatus.OK);
    }
}

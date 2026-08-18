package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.service.RoutineService;
import com.fitnesslab.strain.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequiredArgsConstructor
@RestController
public class RoutineController {
    private final UserRepository userRepository;
    private final UserService userService;
    private final RoutineService routineService;

    @PostMapping("/routines")
    public ResponseEntity<Routine> createRoutine(@RequestBody Routine routine, Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        Routine savedRoutine = routineService.create(user.getId(), routine);
        return ResponseEntity.status(201).body(savedRoutine);
    }
//    @PostMapping("/users/{userId}/workouts",)
//    public ResponseEntity<String> createWorkout(@PathVariable UUID userId, @RequestBody Workout workout){
//        workoutService.create(userId,workout);
//        return new ResponseEntity<>("Success",HttpStatus.OK);
//    }
//
//    @GetMapping("/users/{userId}/workouts")
//    @Operation(summary = "Returns all workouts of a user")
//    public ResponseEntity<List<Workout>> getWorkouts(@PathVariable UUID userId){
//        List<Workout> workouts = workoutService.getWorkoutsByUserId(userId);
//        if(workouts.isEmpty()){
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        return new ResponseEntity<>(workouts, HttpStatus.OK);
//    }

//    @PutMapping("/workouts/{workoutId}")
//    @Operation(summary = "Updates a workout")
//    public ResponseEntity<String> updateWorkout(@PathVariable UUID workoutId,@RequestBody Workout workout)
//    {
//        workoutService.update(workoutId, workout);
//        return ResponseEntity.ok("Updated");
//    }
//
//    @DeleteMapping("/workouts/{workoutId}")
//    @Operation(summary = "Deletes a workout")
//    public ResponseEntity<String> deleteWorkout(@PathVariable UUID workoutId){
//        workoutService.delete(workoutId);
//        return ResponseEntity.ok("Deleted");
//    }
}

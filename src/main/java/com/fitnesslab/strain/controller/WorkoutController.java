package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.model.entity.Workout;
import com.fitnesslab.strain.model.dtos.requests.WorkoutRequestDto;
import com.fitnesslab.strain.model.dtos.responses.WorkoutDto;
import com.fitnesslab.strain.model.mapper.ApiDtoMapper;
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
    private final ApiDtoMapper dtoMapper;

    @PostMapping("/workouts")
    public ResponseEntity<WorkoutDto> addWorkout(@RequestBody WorkoutRequestDto request, Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        Workout createdWorkout = workoutService.create(user.getId(), dtoMapper.toEntity(request));
        return ResponseEntity.status(201).body(dtoMapper.toDto(createdWorkout));
    }

    @GetMapping("/workouts/{workoutId}")
    public ResponseEntity<WorkoutDto> getWorkout(@PathVariable UUID workoutId, Principal principal){
        Workout workout = workoutService.findById(workoutId, principal.getName());
        return ResponseEntity.ok(dtoMapper.toDto(workout));
    }

    @DeleteMapping("/workouts/{workoutId}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable UUID workoutId, Principal principal){
        workoutService.delete(workoutId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

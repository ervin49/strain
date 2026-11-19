package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.dtos.requests.RoutineRequestDto;
import com.fitnesslab.strain.model.dtos.requests.RoutineCreateRequestDto;
import com.fitnesslab.strain.model.dtos.responses.RoutineDto;
import com.fitnesslab.strain.model.mapper.ApiDtoMapper;
import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.User;
import jakarta.validation.Valid;
import com.fitnesslab.strain.service.RoutineService;
import com.fitnesslab.strain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
public class RoutineController {
    private final UserService userService;
    private final RoutineService routineService;
    private final ApiDtoMapper dtoMapper;

    @GetMapping("/routines/{routineId}")
    public ResponseEntity<RoutineDto> getRoutine(@PathVariable UUID routineId, Principal principal){
        Routine routine = routineService.getRoutineById(routineId, principal.getName());
        return ResponseEntity.ok(dtoMapper.toDto(routine));
    }

    @PutMapping("/routines/{routineId}")
    public ResponseEntity<RoutineDto> updateRoutine(@PathVariable UUID routineId, @Valid @RequestBody RoutineRequestDto request, Principal principal){
        Routine routine = routineService.update(routineId, dtoMapper.toEntity(request), principal.getName());
        return ResponseEntity.ok(dtoMapper.toDto(routine));
    }

    @PutMapping("/routines")
    public ResponseEntity<List<UUID>> updateUsersRoutinesOrder(@RequestBody UUID[] routinesIds, Principal principal){
        List<UUID> routines = routineService.updateUsersRoutinesOrder(routinesIds, principal.getName());
        return ResponseEntity.status(200).body(routines);
    }

    @PostMapping("/routines")
    public ResponseEntity<RoutineDto> createRoutine(@Valid @RequestBody RoutineCreateRequestDto request, Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        Routine savedRoutine = routineService.create(user.getId(), dtoMapper.toEntity(request));
        return ResponseEntity.status(201).body(dtoMapper.toDto(savedRoutine));
    }

    @DeleteMapping("/routines/{routineId}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable UUID routineId, Principal principal){
        routineService.delete(routineId, principal.getName());
        return ResponseEntity.noContent().build();
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

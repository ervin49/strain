package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.Models.Workout;
import com.fitnesslab.strain.Repositories.UserRepository;
import com.fitnesslab.strain.Services.UserService;
import com.fitnesslab.strain.Services.WorkoutService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@Controller
@RequestMapping("/workouts")
public class WorkoutController {
    private final UserRepository userRepository;
    private final UserService userService;
    private final WorkoutService workoutService;

    @GetMapping("/new")
    public String createWorkout(Model model){
        model.addAttribute("workout",new Workout());
        return "workout";
    }

    @PostMapping("/new")
    public String createWorkout(@ModelAttribute @Valid Workout workout, BindingResult result, Model model){
        if(result.hasErrors()){
            model.addAttribute("errors",result.getAllErrors());
        }

        return "dashboard";
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

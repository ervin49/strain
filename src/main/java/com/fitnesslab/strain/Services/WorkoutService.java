package com.fitnesslab.strain.Services;

import com.fitnesslab.strain.Exceptions.ResourceNotFoundException;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Models.Workout;
import com.fitnesslab.strain.Repositories.UserRepository;
import com.fitnesslab.strain.Repositories.WorkoutRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    @Transactional
    public void create(UUID userId, Workout workout){
        workoutRepository.save(workout);
        User user = userRepository.getUserById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setNoOfWorkouts(user.getNoOfWorkouts() + 1);
    }

    public List<Workout> getWorkoutsByUserId(UUID userId){
        return workoutRepository.findWorkoutsByUserId(userId);
    }

    public void delete(UUID workoutId) {
        workoutRepository.deleteById(workoutId);
    }

    public void update(UUID workoutId, Workout workout) {
        workoutRepository.getWorkoutById(workoutId).orElseThrow(() -> new ResourceNotFoundException("Workout not found"));
        workoutRepository.deleteById(workoutId);
        workoutRepository.save(workout);
    }
}

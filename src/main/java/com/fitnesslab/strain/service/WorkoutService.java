package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.model.entity.Workout;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    @Transactional
    public Workout create(UUID userId, Workout workout) {
        User user = userRepository.findById(userId).orElseThrow();
        workout.setUser(user);
        workout.setDate(LocalDateTime.now());

        return workoutRepository.save(workout);
    }

    public void delete(UUID workoutId) {
        Workout workout = workoutRepository.findById(workoutId).orElseThrow();
        workoutRepository.delete(workout);
    }
}

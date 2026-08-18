package com.fitnesslab.strain.service;

import com.fitnesslab.strain.exception.ResourceNotFoundException;
import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.repository.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RoutineService {
    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;

    @Transactional
    public Routine create(UUID userId, Routine routine){
        User user = userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        routine.setUser(user);

        int currentNoOfWorkouts = user.getNoOfWorkouts() != null ? user.getNoOfWorkouts() : 0;
        user.setNoOfWorkouts(currentNoOfWorkouts + 1);

        return routineRepository.save(routine);
    }

    public List<Routine> getWorkoutsByUserId(UUID userId){
        return routineRepository.findWorkoutsByUserId(userId);
    }

    public void delete(UUID routineId) {
        routineRepository.deleteById(routineId);
    }

    public void update(UUID routineId, Routine routine) {
        routineRepository.getWorkoutById(routineId).orElseThrow(() -> new ResourceNotFoundException("Workout not found"));
        routineRepository.deleteById(routineId);
        routineRepository.save(routine);
    }
}

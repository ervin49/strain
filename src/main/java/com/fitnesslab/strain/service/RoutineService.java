package com.fitnesslab.strain.service;

import com.fitnesslab.strain.exception.ResourceNotFoundException;
import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.repository.RoutineRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class RoutineService {
    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;

    @Transactional
    public void create(UUID userId, Routine routine){
        routineRepository.save(routine);
        User user = userRepository.getUserById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setNoOfWorkouts(user.getNoOfWorkouts() + 1);
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

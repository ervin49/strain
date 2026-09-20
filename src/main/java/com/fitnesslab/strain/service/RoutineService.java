package com.fitnesslab.strain.service;

import com.fitnesslab.strain.exception.ResourceNotFoundException;
import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.repository.RoutineRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RoutineService {
    @PersistenceContext
    private EntityManager entityManager;

    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;

    @Transactional
    public Routine create(UUID userId, Routine routine){
        User user = userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        routine.setUser(user);

        return routineRepository.save(routine);
    }

    @Transactional
    public void delete(UUID routineId) {
        Routine routine = routineRepository.findById(routineId).orElseThrow();
        routine.getExercises().clear();
        routineRepository.delete(routine);
    }

    @Transactional
    public Routine update(UUID routineId, Routine routine) {
        Routine oldRoutine = routineRepository.findById(routineId).orElseThrow(() -> new ResourceNotFoundException("Routine not found"));
        oldRoutine.setName(routine.getName());
        oldRoutine.setExercises(routine.getExercises());
        oldRoutine.setSets(routine.getSets());
        return routineRepository.save(oldRoutine);
    }

    public Routine getRoutineById(UUID routineId) {
        return routineRepository.findById(routineId).orElseThrow();
    }

    @Transactional
    public List<UUID> updateUsersRoutinesOrder(UUID[] routinesIds, String email) {
        for(int i = 0; i < routinesIds.length; i++){
            Routine routine = entityManager.getReference(Routine.class, routinesIds[i]);
            routine.setRoutineOrder(i);
        }

        User user = userRepository.getUserByEmail(email).orElseThrow();
        return user.getRoutines().stream().map(Routine::getId).toList();
    }
}

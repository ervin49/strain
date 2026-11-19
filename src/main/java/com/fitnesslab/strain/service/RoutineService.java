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

        return routineRepository.save(routine);
    }

    @Transactional
    public void delete(UUID routineId, String email) {
        Routine routine = getOwnedRoutine(routineId, email);
        routine.getExercises().clear();
        routineRepository.delete(routine);
    }

    @Transactional
    public Routine update(UUID routineId, Routine routine, String email) {
        Routine oldRoutine = getOwnedRoutine(routineId, email);
        if (routine.getName() != null && !routine.getName().isBlank()) {
            oldRoutine.setName(routine.getName());
        }

        if (routine.getExercises() != null && !routine.getExercises().isEmpty()) {
            oldRoutine.setExercises(routine.getExercises());
        }

        if (routine.getSets() != null && !routine.getSets().isEmpty()) {
            oldRoutine.setSets(routine.getSets());
        }

        return routineRepository.save(oldRoutine);
    }

    public Routine getRoutineById(UUID routineId, String email) {
        return getOwnedRoutine(routineId, email);
    }

    @Transactional
    public List<UUID> updateUsersRoutinesOrder(UUID[] routinesIds, String email) {
        List<Routine> userRoutines = routineRepository.findAllByUser_Email(email);
        if (routinesIds == null || routinesIds.length != userRoutines.size()) {
            throw new ResourceNotFoundException("Routine not found");
        }

        var routinesById = userRoutines.stream().collect(java.util.stream.Collectors.toMap(Routine::getId, routine -> routine));
        for (int i = 0; i < routinesIds.length; i++) {
            Routine routine = routinesById.remove(routinesIds[i]);
            if (routine == null) {
                throw new ResourceNotFoundException("Routine not found");
            }
            routine.setRoutineOrder(i);
        }

        return List.of(routinesIds);
    }

    private Routine getOwnedRoutine(UUID routineId, String email) {
        return routineRepository.findByIdAndUser_Email(routineId, email)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found"));
    }
}

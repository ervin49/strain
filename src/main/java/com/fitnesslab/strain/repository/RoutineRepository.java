package com.fitnesslab.strain.repository;

import com.fitnesslab.strain.model.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, UUID> {
    List<Routine> findWorkoutsByUserId(UUID userId);

    Optional<Routine> getWorkoutById(UUID workoutId);
}

package com.fitnesslab.strain.Repositories;

import com.fitnesslab.strain.Models.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, UUID> {
    List<Workout> findWorkoutsByUserId(UUID userId);
}

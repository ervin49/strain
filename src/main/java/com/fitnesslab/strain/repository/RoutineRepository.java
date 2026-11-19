package com.fitnesslab.strain.repository;

import com.fitnesslab.strain.model.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, UUID> {
    Optional<Routine> findByIdAndUser_Email(UUID id, String email);
    List<Routine> findAllByUser_Email(String email);
}

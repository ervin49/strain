package com.fitnesslab.strain.repository;

import com.fitnesslab.strain.model.entity.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, UUID> { }

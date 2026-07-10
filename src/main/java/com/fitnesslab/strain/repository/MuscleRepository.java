package com.fitnesslab.strain.repository;

import com.fitnesslab.strain.model.entity.Muscle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MuscleRepository extends JpaRepository<Muscle, UUID> {}

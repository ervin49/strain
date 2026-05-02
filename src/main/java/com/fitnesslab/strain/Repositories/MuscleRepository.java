package com.fitnesslab.strain.Repositories;

import com.fitnesslab.strain.Models.Muscle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MuscleRepository extends JpaRepository<Muscle, UUID> {
}

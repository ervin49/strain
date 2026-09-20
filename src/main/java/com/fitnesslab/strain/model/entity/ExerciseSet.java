package com.fitnesslab.strain.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "exercise_sets")
public class ExerciseSet {
    @Id
    @UuidGenerator
    private UUID id;
    private int setNumber;
    private String weight;
    private String reps;

    private UUID exerciseId;
}


package com.fitnesslab.strain.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
public class ExerciseSet {
    @Id
    @UuidGenerator
    private UUID id;

    private int setNumber;
    private int reps;
    private int weight;
}

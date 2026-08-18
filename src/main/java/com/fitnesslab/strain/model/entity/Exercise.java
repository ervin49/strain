package com.fitnesslab.strain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Table(name = "exercises")
public class Exercise {
    @Id
    @UuidGenerator
    private UUID id;
    private String name;
    private String equipment;

    @ManyToOne
    private Muscle primaryMuscle;

    @ManyToMany
    private List<Muscle> secondaryMuscles;
}

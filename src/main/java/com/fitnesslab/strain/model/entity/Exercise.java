package com.fitnesslab.strain.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Exercise {
    @Id
    @UuidGenerator
    private UUID id;
    private String name;

    @ManyToMany
    private Set<Muscle> muscles;

    @OneToMany
    private List<ExerciseSet> sets;
}

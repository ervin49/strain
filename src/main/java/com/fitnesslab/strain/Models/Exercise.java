package com.fitnesslab.strain.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.Collection;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {
    @Id
    @UuidGenerator
    private UUID id;
    private String name;

    @ManyToMany
    private Collection<Muscle> muscles;
}

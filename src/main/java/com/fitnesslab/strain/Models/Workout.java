package com.fitnesslab.strain.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.Collection;
import java.util.UUID;

@Entity
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class Workout {
    @Id
    @UuidGenerator
    private UUID id;

    @ManyToMany
    private Collection<Exercise> exercises;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

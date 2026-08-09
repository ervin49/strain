package com.fitnesslab.strain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class Routine {
    @Id
    @UuidGenerator
    private UUID id;

    private String name;

    @ManyToMany
    private List<Exercise> exercises;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

package com.fitnesslab.strain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
@Table(name = "routines")
public class Routine {
    @Id
    @UuidGenerator
    private UUID id;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "routines_exercises",
            joinColumns = @JoinColumn(name = "routine_id"),
            inverseJoinColumns = @JoinColumn(name = "exercise_id")
    )
    List<Exercise> exercises;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private Integer routineOrder;
}

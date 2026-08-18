package com.fitnesslab.strain.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "workouts")
public class Workout {
    @Id
    @UuidGenerator
    private UUID id;

    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    private String notes;

    @OneToMany(mappedBy = "workout")
    private List<WorkoutExercise> exercises;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

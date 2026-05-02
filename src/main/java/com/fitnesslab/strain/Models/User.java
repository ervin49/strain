package com.fitnesslab.strain.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    private UUID id;

    @Column(unique = true)
    @NonNull private String email;
    @NonNull private String lastName;
    @NonNull private String firstName;
    @NonNull private String password;
    @Builder.Default
    private int noOfWorkouts = 0;

    @OneToMany(mappedBy = "user")
    private List<Workout> workouts;

    @JsonIgnore
    @Builder.Default
    private Role role = Role.USER;
}
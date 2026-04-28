package com.fitnesslab.strain.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.*;

@Entity
@Data
@Table(name = "users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    private UUID userId;

    @Column(unique = true)
    @NonNull private String email;
    @NonNull private String lastName;
    @NonNull private String firstName;
    @NonNull private String password;

    @JsonIgnore
    @Builder.Default
    private Role role = Role.USER;
}
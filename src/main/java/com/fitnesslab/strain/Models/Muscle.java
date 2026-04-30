package com.fitnesslab.strain.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Muscle {
    @Id
    @UuidGenerator
    private UUID id;

    private String name;
}

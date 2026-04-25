package com.fitnesslab.strain.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Data
public class User {
    @Id
    @UuidGenerator
    private UUID id;

    @Non
    private string email;
}

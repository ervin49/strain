package com.fitnesslab.strain.Models;

import jakarta.persistence.*;

import java.util.Collection;
import java.util.UUID;

@Entity
public class Privilege {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    @ManyToMany(mappedBy = "privileges")
    private Collection<Role> roles;
}

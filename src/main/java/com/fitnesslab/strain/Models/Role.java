package com.fitnesslab.strain.Models;

import jakarta.persistence.*;
import lombok.NonNull;

import java.util.Collection;
import java.util.UUID;

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID roleId;

    @NonNull private String name;
    @ManyToMany(mappedBy = "roles")
    private Collection<User> users;

    @ManyToMany
    @JoinTable(
            name = "roles_privileges",
            joinColumns = @JoinColumn(),
            inverseJoinColumns = @JoinColumn()
    )
    private Collection<Privilege> privileges;
}

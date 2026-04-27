package com.fitnesslab.strain.Repositories;

import com.fitnesslab.strain.Models.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User getUserByEmail(@NonNull String email);

    boolean existsByEmail(@NonNull String email);
}

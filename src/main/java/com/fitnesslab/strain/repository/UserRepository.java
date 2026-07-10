package com.fitnesslab.strain.repository;

import com.fitnesslab.strain.model.entity.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> getUserByEmail(@NonNull String email);

    boolean existsByEmail(@NonNull String email);

    void deleteByEmail(@NonNull String email);

    Optional<User> getUserById(@NonNull UUID userId);
}

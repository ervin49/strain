package com.fitnesslab.strain.Repositories;

import com.fitnesslab.strain.Models.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    User getUserByEmail(@NonNull String email);

    boolean existsByEmail(@NonNull String email);

    void deleteByEmail(@NonNull String email);
}

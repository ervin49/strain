package com.fitnesslab.strain.Configurations;

import com.fitnesslab.strain.DTOs.responses.UserResponseDTO;
import com.fitnesslab.strain.Models.Role;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class InitialConfiguration implements CommandLineRunner {
    private UserRepository userRepository;
    private PasswordEncoder encoder;

    @Override
    public void run(String @NonNull ...args){
        User admin = User.builder()
                .email("admin@admin.com")
                .firstName("admin")
                .lastName("admin")
                .password(encoder.encode("admin"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
    }
}

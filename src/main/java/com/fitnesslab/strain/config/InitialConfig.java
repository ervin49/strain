package com.fitnesslab.strain.config;

import com.fitnesslab.strain.model.entity.Role;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Date;

@Component
@AllArgsConstructor
public class InitialConfig implements CommandLineRunner {
    private UserRepository userRepository;
    private PasswordEncoder encoder;

    @Override
    public void run(String @NonNull ...args){
        if(userRepository.existsByEmail("admin@admin.com")){
            return;
        }

        User admin = User.builder()
                .email("admin@admin.com")
                .firstName("firstName")
                .lastName("lastName")
                .password(encoder.encode("admin"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        System.out.println(admin.getAvatarPath());
    }
}

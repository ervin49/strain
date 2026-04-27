package com.fitnesslab.strain.Services;

import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Repositories.UserRepository;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    UserRepository userRepository;
    PasswordEncoder encoder;
    EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder encoder,EmailService emailService){
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    public List<User> getUsers(){
       return userRepository.findAll();
    }

    public void register(User user){
        user.setPassword(encoder.encode(user.getPassword()));
        emailService.sendEmail(user.getEmail(),"Registration","You have registered successfully! Welcome to Strain!");
        userRepository.save(user);
    }

    public void login(User user){
        encoder.encode(user.getPassword());
    }

    public void changePassword(String email, String newPassword){
        User user = userRepository.getUserByEmail(email);
        userRepository.delete(user);
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }

    public boolean existsByEmail(@NonNull String email) {
        return userRepository.existsByEmail(email);
    }
}

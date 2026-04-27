package com.fitnesslab.strain.Services;

import com.fitnesslab.strain.DTOs.UserDTO;
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

import javax.swing.*;
import java.util.Date;
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

    public String register(User user){
        if(userRepository.existsByEmail(user.getEmail())){
            return "User with this email already exists!";
        }

        String password = user.getPassword();
        if(password.length() < 8){
            return "Password must be at least 8 characters long!";
        }

        int noOfUppercaseChars = 0;
        int noOfNonAlnumChars = 0;
        for(int i = 0; i < password.length(); i++){
            char curr = password.charAt(i);
            if(Character.isUpperCase(curr))
                noOfUppercaseChars++;
            if(!Character.isDigit(curr) && !Character.isLetter(curr)){
                noOfNonAlnumChars++;
            }
        }
        if(noOfUppercaseChars == 0 || noOfNonAlnumChars == 0){
            return "Password must have at least one uppercase letter and one special character!";
        }

        user.setPassword(encoder.encode(password));
        emailService.sendEmail(user.getEmail(),"Registration","You have registered successfully! Welcome to Strain!");
        userRepository.save(user);
        return "success";
    }

    public String login(String email, String password){
        if(userRepository.existsByEmail(email)){
            User user = userRepository.getUserByEmail(email);
            if(user.getPassword().equals(password)){
                return "Logged in";
            }
        }
        return "Wrong email or password";
    }

    public void changePassword(String email, String newPassword){
        User user = userRepository.getUserByEmail(email);

        userRepository.deleteByEmail(email);
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
        emailService.sendEmail(email,"Password changed", "Your password has been changed at: " + new Date());
    }

    public boolean existsByEmail(@NonNull String email) {
        return userRepository.existsByEmail(email);
    }

    public User getByEmail(@NonNull String email) {
        return userRepository.getUserByEmail(email);
    }
}

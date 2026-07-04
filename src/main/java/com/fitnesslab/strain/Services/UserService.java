package com.fitnesslab.strain.Services;

import com.fitnesslab.strain.Exceptions.ResourceNotFoundException;
import com.fitnesslab.strain.DTOs.requests.AuthRequest;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Repositories.UserRepository;
import com.fitnesslab.strain.Security.JwtUtils;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public String register(User user){
        if(existsByEmail(user.getEmail())){
            return "Email already taken.";
        }

        String password = user.getPassword();
        if(password.equals(password.toLowerCase()) || password.matches("[A-Za-z0-9 ]*")){
            return "Password must have at least one uppercase letter and one special character.";
        }

        user.setPassword(encoder.encode(password));
//        emailService.sendEmail(user.getEmail(),"Registration","You have registered successfully! Welcome to Strain!");
        userRepository.save(user);
        return "success";
    }


    public String login(AuthRequest user){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    user.getEmail(),user.getPassword()
            ));

            String email = user.getEmail();
            return jwtUtils.generateToken(email);
        }catch (BadCredentialsException e){
            return "Wrong email or password!";
        }
    }

    public void changePassword(String email, String newPassword){
        User user = userRepository.getUserByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Not found"));

        userRepository.deleteByEmail(email);
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
//        emailService.sendEmail(email,"Password changed", "Your password has been changed at: " + new Date());
    }

    public User getUserByEmail(@NonNull String email) {
        return userRepository.getUserByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }
    public void deleteById(UUID userId){
        userRepository.deleteById(userId);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void deleteByEmail(String email){
        userRepository.deleteByEmail(email);
    }
}

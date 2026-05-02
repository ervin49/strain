package com.fitnesslab.strain.Services;

import com.fitnesslab.strain.Exceptions.ResourceNotFoundException;
import com.fitnesslab.strain.DTOs.requests.UserRequestDTO;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Models.Workout;
import com.fitnesslab.strain.Repositories.UserRepository;
import com.fitnesslab.strain.Security.JwtUtils;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
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
        if(userRepository.existsByEmail(user.getEmail())){
            return "User with this email already exists!";
        }

        String password = user.getPassword();
        if(password.length() < 8){
            return "Password must be at least 8 characters long!";
        }

        int noOfUppercaseChars = 0;
        int noOfNonAlNumChars = 0;
        for(int i = 0; i < password.length(); i++){
            char curr = password.charAt(i);
            if(Character.isUpperCase(curr))
                noOfUppercaseChars++;
            if(!Character.isLetter(curr) && !Character.isDigit(curr)){
                noOfNonAlNumChars++;
            }
        }
        if(noOfUppercaseChars == 0 || noOfNonAlNumChars == 0){
            return "Password must have at least one uppercase letter and one special character!";
        }

        user.setPassword(encoder.encode(password));
//        emailService.sendEmail(user.getEmail(),"Registration","You have registered successfully! Welcome to Strain!");
        userRepository.save(user);
        return "success";
    }


    public String login(UserRequestDTO userDTO){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    userDTO.getEmail(),userDTO.getPassword()
            ));
            String email = userDTO.getEmail();

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
        emailService.sendEmail(email,"Password changed", "Your password has been changed at: " + new Date());
    }

    public User getUserByEmail(@NonNull String email) {
        return userRepository.getUserByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }
    public void deleteById(UUID userId){
        userRepository.deleteById(userId);
    }

}

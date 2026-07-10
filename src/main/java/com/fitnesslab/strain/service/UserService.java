package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.dtos.requests.UpdateProfileRequest;
import com.fitnesslab.strain.exception.ResourceNotFoundException;
import com.fitnesslab.strain.model.dtos.requests.AuthRequest;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.security.JwtUtils;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
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
    private final ImageService imageService;

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
            return "Password is wrong.";
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

    public void updateUserProfile(UpdateProfileRequest request, Principal principal){
        User user = getUserByEmail(principal.getName());
        if(request.getFirstName() != null && !request.getFirstName().isEmpty()){
            user.setFirstName(request.getFirstName());
        }
        if(request.getLastName() != null && !request.getLastName().isEmpty()){
            user.setLastName(request.getLastName());
        }
        if(request.getDateOfBirth() != null){
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if(request.getFile() != null && !request.getFile().isEmpty()){
            imageService.storeImage(request.getFile(),user.getEmail());
        }
    }
}

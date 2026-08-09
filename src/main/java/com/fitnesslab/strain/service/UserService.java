package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.dtos.requests.RegisterRequest;
import com.fitnesslab.strain.model.dtos.requests.UpdateProfileRequest;
import com.fitnesslab.strain.exception.ResourceNotFoundException;
import com.fitnesslab.strain.model.dtos.requests.AuthRequest;
import com.fitnesslab.strain.model.dtos.responses.ExerciseDto;
import com.fitnesslab.strain.model.dtos.responses.MuscleDto;
import com.fitnesslab.strain.model.dtos.responses.RoutineDto;
import com.fitnesslab.strain.model.dtos.responses.UserProfileDto;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.repository.UserRepository;
import com.fitnesslab.strain.security.JwtUtils;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public List<String> register(RegisterRequest request){
        List<String> errors = new ArrayList<>();
        if(existsByEmail(request.getEmail())){
            errors.add("Email already taken.");
            return errors;
        }

        String password = request.getPassword();
        boolean hasError = false;
        if(password.length() < 8){
            errors.add("Password must be at least 8 characters long.");
            hasError = true;
        }

        if(password.equals(password.toLowerCase()) || password.matches("[A-Za-z0-9 ]*")){
            errors.add("Password must have at least one uppercase letter and one special character.");
            hasError = true;
        }

        if(hasError){
            return errors;
        }

        String unencodedPassword = request.getPassword();
        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(encoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
//        emailService.sendEmail(user.getEmail(),"Registration","You have registered successfully! Welcome to Strain!");
        String token = login(new AuthRequest(user.getEmail(), unencodedPassword));
        return List.of(token);
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

    public UserProfileDto getUserProfileByEmail(String email){
        User user = getUserByEmail(email);
        List<RoutineDto> routineDtos = user.getRoutines().stream()
                .map(routine -> new RoutineDto(
                        routine.getId(),
                        routine.getName(),
                        routine.getExercises().stream()
                                .map(exercise -> new ExerciseDto(
                                        exercise.getId(),
                                        exercise.getName(),
                                        exercise.getMuscles().stream()
                                                .map(muscle -> new MuscleDto(
                                                        muscle.getId(),
                                                        muscle.getName()
                                                )).collect(Collectors.toSet())
                                )).toList()
                )).toList();

        return new UserProfileDto(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getDateOfBirth(),
                routineDtos,
                user.getAvatarPath()
        );
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
        if(request.getFile() != null && !request.getFile().isEmpty()){
            imageService.storeImage(request.getFile(),user.getEmail());
        }
        if(request.getFirstName() != null && !request.getFirstName().isEmpty()){
            user.setFirstName(request.getFirstName());
        }
        if(request.getLastName() != null && !request.getLastName().isEmpty()){
            user.setLastName(request.getLastName());
        }
        if(request.getDateOfBirth() != null){
            user.setDateOfBirth(request.getDateOfBirth());
        }

        userRepository.save(user);
    }
}

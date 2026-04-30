package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.DTOs.requests.UserRequestDTO;
import com.fitnesslab.strain.DTOs.responses.UserResponseDTO;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Security.JwtUtils;
import com.fitnesslab.strain.Services.UserService;
import com.fitnesslab.strain.UserMapper;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @GetMapping("/")
    public List<UserResponseDTO> getUsers(){
        return userService.getUsers()
                .stream()
                .map(userMapper::toDTO).toList();
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserResponseDTO> getPersonalAccount(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.isAuthenticated()){
            String email = authentication.getName();
            User user = userService.getByEmail(email);
            return new ResponseEntity<>(userMapper.toDTO(user), HttpStatus.OK);
        }
        return new ResponseEntity<>((HttpHeaders) null, HttpStatus.BAD_REQUEST);
    }



    @GetMapping("/")
    public ResponseEntity<String> home(){
        return new ResponseEntity<>("Welcome!",HttpStatus.OK);
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user){
        String message = userService.register(user);
        if(!message.equals("success")){
            return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("Registration successful!", HttpStatus.CREATED);
    }

    @PostMapping("/workouts")
    public ResponseEntity<Map<String,String>> addWorkout(@RequestBody UserRequestDTO userDTO){
        String result = userService.login(userDTO);
        if(result.equals("Wrong email or password!")){
            return new ResponseEntity<>(Map.of("error", result),HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(Map.of("jwt", result),HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody UserRequestDTO userDTO){
        String result = userService.login(userDTO);
        if(result.equals("Wrong email or password!")){
            return new ResponseEntity<>(Map.of("error", result),HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(Map.of("jwt", result),HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<User> logout(@RequestBody User user){
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody String email, @RequestBody String newPassword){
        userService.changePassword(email,newPassword);
        return new ResponseEntity<>("You have changed your password!",HttpStatus.OK);
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id){

    }

}
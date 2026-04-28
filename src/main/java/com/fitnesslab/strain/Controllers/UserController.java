package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.DTOs.requests.UserRequestDTO;
import com.fitnesslab.strain.DTOs.responses.UserResponseDTO;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Security.JwtUtils;
import com.fitnesslab.strain.Services.UserService;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public UserController(UserService userService, JwtUtils jwtUtils, AuthenticationManager authenticationManager){
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("/admin")
    public ResponseEntity<String> adminTest(){
        return new ResponseEntity<>("Welcome admin!",HttpStatus.OK);
    }

    @GetMapping("/users")
    public List<UserResponseDTO> getUsers(){
        return userService.getUsers()
                .stream()
                .map(user -> new UserResponseDTO(user.getEmail(),user.getFirstName(),user.getLastName())).toList();
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

    @PostMapping("/forgot-password")
    public ResponseEntity<String> changePassword(@RequestBody String email, @RequestBody String newPassword){
        userService.changePassword(email,newPassword);
        return new ResponseEntity<>("You have changed your password!",HttpStatus.OK);
    }

}
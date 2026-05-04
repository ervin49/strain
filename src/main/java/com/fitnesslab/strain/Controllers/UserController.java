package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.DTOs.requests.UserRequestDTO;
import com.fitnesslab.strain.DTOs.responses.UserResponseDTO;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Security.JwtUtils;
import com.fitnesslab.strain.Services.UserService;
import com.fitnesslab.strain.Utils.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @GetMapping("/")
    @Operation(summary = "index page")
    public String home(Model model, Principal principal){
        if(principal == null){
            return "index";
        }

        return "dashboard";
    }

    @GetMapping("/users")
    @Operation(summary = "Retrieves all users")
    public List<UserResponseDTO> getUsers(){
        return userService.getUsers()
                .stream()
                .map(userMapper::toDTO).toList();
    }

    @GetMapping("/users/me")
    @Operation(summary = "Retrieves details about currently logged in user")
    public ResponseEntity<UserResponseDTO> getPersonalAccount(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.isAuthenticated()){
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            return new ResponseEntity<>(userMapper.toDTO(user), HttpStatus.OK);
        }
        return new ResponseEntity<>((HttpHeaders) null, HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/register")
    @Operation(summary = "Register form")
    public String registerForm(Model model){
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    @Operation(summary = "Registers user")
    public String registerUser(@ModelAttribute User user){
        String message = userService.register(user);
        if(!message.equals("success")){
            return
        }
        return "redirect:/login";
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

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id){
        userService.deleteById(id);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }
}
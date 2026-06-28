package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.DTOs.requests.UserRequestDTO;
import com.fitnesslab.strain.DTOs.responses.UserResponseDTO;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Security.JwtUtils;
import com.fitnesslab.strain.Services.UserService;
import com.fitnesslab.strain.Utils.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @GetMapping("/")
    @Operation(summary = "Index page")
    public String home(Principal principal){
        if(principal == null){
            return "redirect:register";
        }

        return "dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(){
        return "dashboard";
    }

    @GetMapping("/users")
    @Operation(summary = "Retrieves all users")
    public String getUsers(Model model){
        model.addAttribute("users",userService.getUsers());
        return "users";
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
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/register")
    @Operation(summary = "Register form")
    public String registerForm(Model model){
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    @Operation(summary = "Registers user")
    public String registerUser(@ModelAttribute @Valid User user, BindingResult result){
        if(result.hasErrors()){
            return "register";
        }
        userService.register(user);
        return "login";
    }

    @GetMapping("/login")
    @Operation(summary = "Logins user")
    public String loginForm(Model model){
        model.addAttribute("user",new UserRequestDTO());
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@ModelAttribute UserRequestDTO userDTO, Model model){
        if(userService.existsByEmail(userDTO.getEmail())) {
            if(userService.login(userDTO).equals("Wrong email or password!")) {
                model.addAttribute("passwordError","Password is wrong!");
                return "login";
            }

            return "dashboard";
        }

        model.addAttribute("emailError","Email is wrong!");
        return "login";
    }

    @PostMapping("/logout")
    public ResponseEntity<User> logout(@RequestBody User user){
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody String email, String newPassword, Model model){
        return "change-password";
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id){
        userService.deleteById(id);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }
}
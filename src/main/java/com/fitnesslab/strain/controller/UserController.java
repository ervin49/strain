package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.dtos.requests.AuthRequest;
import com.fitnesslab.strain.model.dtos.requests.ChangePassRequest;
import com.fitnesslab.strain.model.dtos.requests.UpdateProfileRequest;
import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.security.JwtConfig;
import com.fitnesslab.strain.service.ImageService;
import com.fitnesslab.strain.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtConfig jwtConfig;
    private final PasswordEncoder encoder;
    private final ImageService imageService;

    @GetMapping("/me")
    public ResponseEntity<String> me(Principal principal){
        if(principal == null){
            return ResponseEntity.badRequest().body("Not logged in");
        }

        return ResponseEntity.ok("Logged in");
    }
    @GetMapping("/users")
    @Operation(summary = "Retrieves all users")
    public ResponseEntity<List<User>> getUsers(){
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping("/profile")
    @Operation(summary = "Retrieves details about currently logged in user")
    public ResponseEntity<User> getPersonalAccount(Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/settings")
    public String settings(Model model,Principal principal){
        System.out.println(userService.getUserByEmail(principal.getName()).getAvatarPath());
        model.addAttribute("request", new UpdateProfileRequest());
        return "users/settings";
    }

    @PostMapping("/update-profile")
    public String updateProfile(@ModelAttribute("request") UpdateProfileRequest request, Principal principal){
        userService.updateUserProfile(request, principal);
        return "redirect:/settings";
    }

    @GetMapping("/routines")
    @Operation(summary = "Retrieves user's routines")
    public ResponseEntity<List<Routine>> getRoutines(Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(user.getRoutines());
    }

    @PostMapping("/register")
    @Operation(summary = "Registers user")
    public ResponseEntity<List<String>> registerUser(@RequestBody @Valid User user){
        String status = userService.register(user);
        if(!status.equals("success")){
            return ResponseEntity.badRequest().body(List.of(status));
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody AuthRequest user, HttpServletResponse response){
        if(userService.existsByEmail(user.getEmail())) {
            String token = userService.login(user);
            if(token.equals("Password is wrong.")) {
                return ResponseEntity.badRequest().body(token);
            }

            ResponseCookie cookie = ResponseCookie.from("token",token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(jwtConfig.getExpiration())
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.badRequest().body("Email is wrong.");
    }

    @PostMapping("/settings/change-password")
    public ResponseEntity<String> changePassword(@ModelAttribute @Valid ChangePassRequest request){
        String email = request.getEmail(),
                oldPassword = request.getOldPassword(),
                newPassword = request.getNewPassword();
        if(userService.existsByEmail(email)){
            User user = userService.getUserByEmail(email);
            if(encoder.encode(oldPassword).equals(user.getPassword())){
                userService.changePassword(email,newPassword);
                return ResponseEntity.ok("success");
            }

            return ResponseEntity.badRequest().body("The password you entered is incorrect.");
        }

        return ResponseEntity.badRequest().body("The email you entered isn't connected to an account.");
    }

    @DeleteMapping("/profile")
    public String deleteUser(Principal principal){
        userService.deleteByEmail(principal.getName());
        return "users/profile";
    }
}

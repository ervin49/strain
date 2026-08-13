package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.dtos.requests.AuthRequest;
import com.fitnesslab.strain.model.dtos.requests.ChangePasswordDto;
import com.fitnesslab.strain.model.dtos.requests.RegisterRequest;
import com.fitnesslab.strain.model.dtos.requests.UpdateProfileRequest;
import com.fitnesslab.strain.model.dtos.responses.UserProfileDto;
import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.User;
import com.fitnesslab.strain.security.JwtConfig;
import com.fitnesslab.strain.security.JwtUtils;
import com.fitnesslab.strain.service.ImageService;
import com.fitnesslab.strain.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Objects;

@RestController
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtConfig jwtConfig;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder encoder;
    private final ImageService imageService;

    @GetMapping("/me")
    public ResponseEntity<String> me(Principal principal){
        if(principal == null){
            return ResponseEntity.badRequest().body("Not logged in");
        }

        return ResponseEntity.ok("Logged in as " + principal.getName());
    }

    @GetMapping("/users")
    @Operation(summary = "Retrieves all users")
    public ResponseEntity<List<User>> getUsers(){
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping("/profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(Principal principal) throws IOException {
        byte[] image = imageService.downloadImage(principal.getName());
        String contentType = imageService.getContentTypeOfAvatar(principal.getName());
        return ResponseEntity.ok().contentType(MediaType.valueOf(contentType)).body(image);
    }

    @PostMapping("/update-profile")
    public ResponseEntity<String> updateProfile(UpdateProfileRequest request, Principal principal){
        userService.updateUserProfile(request, principal);
        return ResponseEntity.ok("Success");
    }

    @GetMapping("/routines")
    @Operation(summary = "Retrieves user's routines")
    public ResponseEntity<List<Routine>> getRoutines(Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(user.getRoutines());
    }

    @PostMapping("/register")
    @Operation(summary = "Registers user")
    public ResponseEntity<List<String>> registerUser(@Valid @RequestBody RegisterRequest user, HttpServletResponse response){
        List<String> status = userService.register(user);
        if(status.size() == 1 && jwtUtils.isJWT(status.getFirst())){
            String token = status.getFirst();
            ResponseCookie cookie = ResponseCookie.from("token",token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(jwtConfig.getExpiration())
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());
            return ResponseEntity.ok(List.of("success"));
        }

        return ResponseEntity.badRequest().body(status);
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

    @GetMapping("/my-details")
    public ResponseEntity<UserProfileDto> myDetails(Principal principal){
        return ResponseEntity.ok(userService.getUserProfileByEmail(principal.getName()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordDto request,
            Principal principal) {
        String email = principal.getName();
        User user = userService.getUserByEmail(email);
        String currentPassword = request.getCurrentPassword();
        String newPassword = request.getNewPassword();

        if (encoder.matches(currentPassword, user.getPassword())) {
            userService.changePassword(email, newPassword);
            return ResponseEntity.ok("Password changed successfully.");
        }

        return ResponseEntity.badRequest().body("The password you entered is incorrect.");
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser(Principal principal){
        userService.deleteByEmail(principal.getName());
        return ResponseEntity.noContent().build();
    }
}

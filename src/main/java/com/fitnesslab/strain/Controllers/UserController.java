package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.DTOs.requests.AuthRequest;
import com.fitnesslab.strain.DTOs.requests.ChangePassRequest;
import com.fitnesslab.strain.DTOs.requests.UpdateProfileRequest;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Security.JwtConfig;
import com.fitnesslab.strain.Services.ImageService;
import com.fitnesslab.strain.Services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;

@Controller
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtConfig jwtConfig;
    private final PasswordEncoder encoder;
    private final ImageService imageService;


    @GetMapping("/")
    @Operation(summary = "Index page")
    public String home(Principal principal){
        if(principal == null){
            return "redirect:/register";
        }

        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Principal principal, Model model){
        if(principal == null){
            return "redirect:/register";
        }

        return "users/dashboard";
    }

    @PostMapping("/change-username")
    public String changeUsername(Model model){

        return "users/profile";
    }

    @GetMapping("/users")
    @Operation(summary = "Retrieves all users")
    public String getUsers(Model model){
        model.addAttribute("users",userService.getUsers());
        return "admin/users";
    }

    @GetMapping("/profile")
    @Operation(summary = "Retrieves details about currently logged in user")
    public String getPersonalAccount(Model model, Principal principal){
        if(principal == null){
            return "redirect:/register";
        }

        model.addAttribute("toEdit", new UpdateProfileRequest());
        return "users/profile";
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
    public String getRoutines(Model model, Principal principal){
        if(principal == null){
            return "redirect:/register";
        }

        return "workout/routines";
    }

    @GetMapping("/register")
    @Operation(summary = "Register form")
    public String registerForm(Model model, Principal principal){
        if(principal != null){
            return "redirect:/dashboard";
        }

        model.addAttribute("user", new User());
        return "auth/register";
    }

    @PostMapping("/register")
    @Operation(summary = "Registers user")
    public String registerUser(@ModelAttribute @Valid User user, BindingResult result){
        String status = userService.register(user);
        if(!status.equals("success")){
            result.addError(new ObjectError("user", status));
            return "auth/register";
        }
        if(result.hasErrors()) {
            return "auth/register";
        }

        return "redirect:/login";
    }

    @GetMapping("/login")
    @Operation(summary = "Logins user")
    public String loginForm(Model model, Principal principal){
        if(principal != null){
            return "redirect:/dashboard";
        }

        model.addAttribute("user",new AuthRequest());
        return "auth/login";
    }

    @PostMapping("/login")
    public String loginUser(@ModelAttribute("user") @Valid AuthRequest user, BindingResult result, HttpServletResponse response, Model model, Principal principal){
        if(principal != null){
            return "redirect:/dashboard";
        }

        if(userService.existsByEmail(user.getEmail())) {
            String token = userService.login(user);
            if(token.equals("Wrong email or password!")) {
                model.addAttribute("passwordError","Password is wrong.");
                return "auth/login";
            }

            ResponseCookie cookie = ResponseCookie.from("token",token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(jwtConfig.getExpiration())
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());
            return "redirect:/dashboard";
        }

        model.addAttribute("emailError","Email is wrong.");
        return "auth/login";
    }

    @GetMapping("/settings/change-password")
    public String getChangePassowrd(Model model){
        model.addAttribute("request",new ChangePassRequest());
        return "users/change-password";
    }

    @PostMapping("/settings/change-password")
    public String changePassword(@ModelAttribute @Valid ChangePassRequest request,
            Model model){
        String email = request.getEmail(),
                oldPassword = request.getOldPassword(),
                newPassword = request.getNewPassword();
        if(userService.existsByEmail(email)){
            User user = userService.getUserByEmail(email);
            if(encoder.encode(oldPassword).equals(user.getPassword())){
                userService.changePassword(email,newPassword);
                return "users/change-password";
            }

            model.addAttribute("passwordError","The password you entered is incorrect.");
            return "users/change-password";
        }

        model.addAttribute("emailError","The email you entered isn't connected to an account.");
        return "users/change-password";
    }

    @DeleteMapping("/profile")
    public String deleteUser(Principal principal){
        userService.deleteByEmail(principal.getName());
        return "users/profile";
    }
}

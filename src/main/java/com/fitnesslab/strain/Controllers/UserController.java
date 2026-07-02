package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.DTOs.requests.UserRequestDTO;
import com.fitnesslab.strain.DTOs.responses.UserResponseDTO;
import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Security.JwtConfig;
import com.fitnesslab.strain.Security.JwtUtils;
import com.fitnesslab.strain.Services.UserService;
import com.fitnesslab.strain.Utils.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);
    private final JwtConfig jwtConfig;
    private final PasswordEncoder encoder;


    @GetMapping("/")
    @Operation(summary = "Index page")
    public String home(Principal principal){
        if(principal == null){
            return "redirect:/register";
        }

        return "dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Principal principal, Model model){
        if(principal == null){
            return "redirect:/register";
        }

        User user = userService.getUserByEmail(principal.getName());
        model.addAttribute("user", user);
        return "dashboard";
    }

    @GetMapping("/users")
    @Operation(summary = "Retrieves all users")
    public String getUsers(Model model){
        model.addAttribute("users",userService.getUsers());
        return "users";
    }

    @GetMapping("/profile")
    @Operation(summary = "Retrieves details about currently logged in user")
    public String getPersonalAccount(Model model, Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        model.addAttribute("user", user);
        return "profile";
    }

    @GetMapping("/routines")
    @Operation(summary = "Retrieves user's routines")
    public String getRoutines(Model model, Principal principal){
        User user = userService.getUserByEmail(principal.getName());
        model.addAttribute("user",user);
        return "routines";
    }

    @GetMapping("/register")
    @Operation(summary = "Register form")
    public String registerForm(Model model, Principal principal){
        if(principal != null){
            return "redirect:/dashboard";
        }

        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    @Operation(summary = "Registers user")
    public String registerUser(@ModelAttribute @Valid User user, BindingResult result, Model model){
        String status = userService.register(user);
        if(!status.equals("success")) {
            model.addAttribute("errorMessage", status);
        }
        if(result.hasErrors() || !status.equals("success")) {
            return "register";
        }

        return "login";
    }

    @GetMapping("/login")
    @Operation(summary = "Logins user")
    public String loginForm(Model model, Principal principal){
        if(principal != null){
            return "redirect:/dashboard";
        }

        model.addAttribute("user",new UserRequestDTO());
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@ModelAttribute UserRequestDTO user, HttpServletResponse response, Model model, Principal principal){
        if(principal != null){
            return "redirect:/dashboard";
        }

        if(userService.existsByEmail(user.getEmail())) {
            String token = userService.login(user);
            if(token.equals("Wrong email or password!")) {
                model.addAttribute("passwordError","Password is wrong!");
                return "login";
            }

            ResponseCookie cookie = ResponseCookie.from("token",token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(jwtConfig.getExpiration())
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE,cookie.toString());
            return "dashboard";
        }

        model.addAttribute("emailError","Email is wrong!");
        return "login";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, Principal principal){
        if(principal == null){
            return "redirect:/login";
        }

        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies){
            if(cookie.getName().equals("token")){
                cookie.setMaxAge(0);
                break;
            }
        }

        return "redirect:/login";
    }

    @GetMapping("/change-password")
    public String getChangePassowrd(Model model){
        String email = "", oldPassword = "", newPassword = "";
        model.addAttribute("email", email);
        model.addAttribute("oldPassword", oldPassword);
        model.addAttribute("newPassword", newPassword);
        return "change-password";
    }

    @PostMapping("/change-password")
    public String changePassword(
            @ModelAttribute String email,
            @ModelAttribute String oldPassword,
            @ModelAttribute String newPassword,
            Model model){
        if(userService.existsByEmail(email)){
            User user = userService.getUserByEmail(email);
            if(encoder.encode(oldPassword).equals(user.getPassword())){
                userService.changePassword(email,newPassword);
                return "change-password";
            }

            model.addAttribute("passwordError","The password you entered is incorrect.");
            return "change-password";
        }

        model.addAttribute("emailError","The email you entered isn't connected to an account.");
        return "change-password";
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id){
        userService.deleteById(id);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }
}
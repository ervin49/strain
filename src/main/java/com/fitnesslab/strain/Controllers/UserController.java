package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Security.JwtUtil;
import com.fitnesslab.strain.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/admin")
    public ResponseEntity<String> adminTest(){
        return new ResponseEntity<>("Welcome admin!",HttpStatus.OK);
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

        return new ResponseEntity<>(user.toString(), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String email, @RequestBody String password){
        String result = userService.login(email, password);
        if(result.equals("Wrong email or password")){
            return new ResponseEntity<>(result,HttpStatus.BAD_REQUEST);
        }

        User user = userService.getByEmail(email);
        String token = jwtUtil.generateToken(email,user.getFirstName(),user.getLastName());
        return new ResponseEntity<>(token,HttpStatus.OK);
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

    @GetMapping("/users")
    public List<User> users(){
        return userService.getUsers();
    }

}
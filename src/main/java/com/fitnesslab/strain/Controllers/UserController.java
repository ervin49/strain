package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Services.UserService;
import jdk.jfr.ContentType;
import org.apache.catalina.LifecycleState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
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
        if(userService.existsByEmail(user.getEmail())) {
            return new ResponseEntity<>("User with this email already exists!", HttpStatus.BAD_REQUEST);
        }
        userService.register(user);
        return new ResponseEntity<>(user.toString(), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user){
        userService.login(user);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @GetMapping("/users")
    public List<User> users(){
        return userService.getUsers();
    }

}
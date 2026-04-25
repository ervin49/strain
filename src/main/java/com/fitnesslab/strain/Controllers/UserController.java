package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public HttpStatus register(User user){
        userService.register(user);
        return HttpStatus.OK;
    }
}
package com.fitnesslab.strain.Configurations;

import com.fitnesslab.strain.Models.User;
import com.fitnesslab.strain.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.security.Principal;

@ControllerAdvice
@AllArgsConstructor
public class GlobalModelAttributes {
    private UserService userService;

    @ModelAttribute("currentURI")
    public String getCurrentUri(HttpServletRequest request){
        return request.getRequestURI();
    }

    @ModelAttribute("principal")
    public User getCurrentlyLoggedInUser(Principal principal){
        if(principal == null){
            return null;
        }

        return userService.getUserByEmail(principal.getName());
    }
}

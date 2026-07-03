package com.fitnesslab.strain.Configurations;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalURI {

    @ModelAttribute("currentURI")
    public String getCurrentUri(HttpServletRequest request){
        return request.getRequestURI();
    }
}

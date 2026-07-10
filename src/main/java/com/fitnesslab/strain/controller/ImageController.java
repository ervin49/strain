package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.service.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@Controller
@AllArgsConstructor
public class ImageController {
    private ImageService imageService;

    @GetMapping("/upload")
    public String image(Model model){
        return "users/profile";
    }

    @PostMapping("/upload")
    public String uploadImage(Model model, @RequestParam MultipartFile file, Principal principal){

        String email = principal.getName();
        imageService.storeImage(file, email);
        model.addAttribute("successMessage","Success!");
        return "users/profile";
    }
}

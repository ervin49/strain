package com.fitnesslab.strain.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @GetMapping("/admin")
    public ResponseEntity<String> adminTest(){
        return new ResponseEntity<>("Welcome admin!", HttpStatus.OK);
    }
}

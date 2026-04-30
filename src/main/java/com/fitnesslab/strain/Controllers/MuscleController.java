package com.fitnesslab.strain.Controllers;

import com.fitnesslab.strain.Models.Muscle;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MuscleController {

    @GetMapping("/muscles")
    public ResponseEntity<List<Muscle>> getMuscles(){

    }

    @PostMapping("/muscles")
    public ResponseEntity<String> addMuscle(){

    }

    @DeleteMapping
    public ResponseEntity<String> deleteMuscle(){

    }

}

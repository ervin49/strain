package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.dtos.requests.MuscleRequestDto;
import com.fitnesslab.strain.model.dtos.responses.MuscleDto;
import com.fitnesslab.strain.model.mapper.ApiDtoMapper;
import com.fitnesslab.strain.service.MuscleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MuscleController {
    private final MuscleService muscleService;
    private final ApiDtoMapper dtoMapper;

    @GetMapping("/muscles")
    public ResponseEntity<List<MuscleDto>> getMuscles(){
        return ResponseEntity.ok(muscleService.getAll().stream().map(dtoMapper::toDto).toList());
    }

    @PostMapping("/muscles")
    public ResponseEntity<MuscleDto> addMuscle(@RequestBody MuscleRequestDto request){
        return ResponseEntity.status(201).body(dtoMapper.toDto(muscleService.create(dtoMapper.toEntity(request))));
    }

    @DeleteMapping("/muscles/{id}")
    public ResponseEntity<Void> deleteMuscle(@PathVariable UUID id){
        muscleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
//
//    @DeleteMapping
//    public ResponseEntity<String> deleteMuscle(){
//
//    }

}

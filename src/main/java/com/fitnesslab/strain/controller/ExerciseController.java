package com.fitnesslab.strain.controller;

import com.fitnesslab.strain.model.dtos.requests.ExerciseRequestDto;
import com.fitnesslab.strain.model.dtos.responses.ExerciseDto;
import com.fitnesslab.strain.model.mapper.ApiDtoMapper;
import com.fitnesslab.strain.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseService exerciseService;
    private final ApiDtoMapper dtoMapper;

    @GetMapping("/exercises")
    public ResponseEntity<List<ExerciseDto>> getExercises(){
        return ResponseEntity.ok(exerciseService.getAll().stream().map(dtoMapper::toDto).toList());
    }

    @PostMapping("/exercises-by-names")
    public ResponseEntity<List<ExerciseDto>> getExercisesByNames(@RequestBody List<String> exercisesNames){
        return ResponseEntity.ok(exerciseService.getExercisesByNames(exercisesNames).stream().map(dtoMapper::toDto).toList());
    }

    @PostMapping("/exercises")
    public ResponseEntity<ExerciseDto> createExercise(@RequestBody ExerciseRequestDto request){
        return ResponseEntity.status(201).body(dtoMapper.toDto(exerciseService.create(dtoMapper.toEntity(request))));
    }
}

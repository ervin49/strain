package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.entity.Exercise;
import com.fitnesslab.strain.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;

    public List<Exercise> getAll(){
        return exerciseRepository.findAll();
    }

    public Exercise create(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }
}

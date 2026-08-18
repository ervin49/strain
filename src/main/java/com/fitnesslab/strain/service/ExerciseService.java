package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.entity.Exercise;
import com.fitnesslab.strain.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;

    public Exercise create(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }
}

package com.fitnesslab.strain.model.dtos.requests;

import com.fitnesslab.strain.model.dtos.responses.MuscleDto;

import java.util.List;

public record ExerciseRequestDto(String name, String equipment, MuscleDto primaryMuscle,
                                 List<MuscleDto> secondaryMuscles) { }

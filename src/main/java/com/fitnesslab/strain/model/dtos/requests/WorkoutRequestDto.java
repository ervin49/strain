package com.fitnesslab.strain.model.dtos.requests;

import com.fitnesslab.strain.model.dtos.responses.ExerciseDto;
import com.fitnesslab.strain.model.dtos.responses.ExerciseSetDto;

import java.util.List;

public record WorkoutRequestDto(String routineName, int duration, List<ExerciseDto> exercises,
                                List<ExerciseSetDto> sets, Integer volume) { }

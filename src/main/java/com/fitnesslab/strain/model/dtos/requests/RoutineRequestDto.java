package com.fitnesslab.strain.model.dtos.requests;

import com.fitnesslab.strain.model.dtos.responses.ExerciseDto;
import com.fitnesslab.strain.model.dtos.responses.ExerciseSetDto;

import java.util.List;

public record RoutineRequestDto(String name, List<ExerciseDto> exercises, List<ExerciseSetDto> sets) { }

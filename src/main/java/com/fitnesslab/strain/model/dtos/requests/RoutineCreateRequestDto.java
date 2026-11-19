package com.fitnesslab.strain.model.dtos.requests;

import com.fitnesslab.strain.model.dtos.responses.ExerciseDto;
import com.fitnesslab.strain.model.dtos.responses.ExerciseSetDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RoutineCreateRequestDto(
        @NotBlank(message = "Routine name is required.")
        @Size(max = 100, message = "Routine name must be at most 100 characters.") String name,
        List<@Valid ExerciseDto> exercises,
        List<@Valid ExerciseSetDto> sets) { }

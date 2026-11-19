package com.fitnesslab.strain.model.dtos.requests;

import com.fitnesslab.strain.model.dtos.responses.ExerciseDto;
import com.fitnesslab.strain.model.dtos.responses.ExerciseSetDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.util.List;

public record WorkoutRequestDto(
        @NotBlank(message = "Routine name is required.")
        @Size(max = 100, message = "Routine name must be at most 100 characters.") String routineName,
        @PositiveOrZero(message = "Duration cannot be negative.") int duration,
        List<@Valid ExerciseDto> exercises,
        List<@Valid ExerciseSetDto> sets,
        @PositiveOrZero(message = "Volume cannot be negative.") Integer volume) { }

package com.fitnesslab.strain.model.dtos.requests;

import com.fitnesslab.strain.model.dtos.responses.MuscleDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ExerciseRequestDto(
        @NotBlank(message = "Exercise name is required.")
        @Size(max = 100, message = "Exercise name must be at most 100 characters.") String name,
        @NotBlank(message = "Equipment is required.")
        @Size(max = 100, message = "Equipment must be at most 100 characters.") String equipment,
        @NotNull(message = "Primary muscle is required.") @Valid MuscleDto primaryMuscle,
        List<@Valid MuscleDto> secondaryMuscles) { }

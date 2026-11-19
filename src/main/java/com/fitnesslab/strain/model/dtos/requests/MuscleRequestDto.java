package com.fitnesslab.strain.model.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MuscleRequestDto(@NotBlank(message = "Muscle name is required.")
                               @Size(max = 100, message = "Muscle name must be at most 100 characters.") String name) { }

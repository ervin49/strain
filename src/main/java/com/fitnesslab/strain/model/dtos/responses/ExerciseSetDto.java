package com.fitnesslab.strain.model.dtos.responses;

import jakarta.validation.constraints.PositiveOrZero;

import java.util.UUID;

public record ExerciseSetDto(UUID id, @PositiveOrZero(message = "Set number cannot be negative.") int setNumber,
                             String weight, String reps, UUID exerciseId) { }

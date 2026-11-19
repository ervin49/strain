package com.fitnesslab.strain.model.dtos.responses;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record ExerciseDto(@NotNull(message = "Exercise ID is required.") UUID id, String name, String equipment, MuscleDto primaryMuscle,
                          List<MuscleDto> secondaryMuscles) { }

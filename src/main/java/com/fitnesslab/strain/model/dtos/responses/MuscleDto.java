package com.fitnesslab.strain.model.dtos.responses;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record MuscleDto(@NotNull(message = "Muscle ID is required.") UUID id, String name) { }

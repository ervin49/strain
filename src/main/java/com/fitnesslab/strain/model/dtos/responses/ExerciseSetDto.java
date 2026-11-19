package com.fitnesslab.strain.model.dtos.responses;

import java.util.UUID;

public record ExerciseSetDto(UUID id, int setNumber, String weight, String reps, UUID exerciseId) { }

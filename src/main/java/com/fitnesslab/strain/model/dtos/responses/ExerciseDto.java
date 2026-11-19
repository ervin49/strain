package com.fitnesslab.strain.model.dtos.responses;

import java.util.List;
import java.util.UUID;

public record ExerciseDto(UUID id, String name, String equipment, MuscleDto primaryMuscle,
                          List<MuscleDto> secondaryMuscles) { }

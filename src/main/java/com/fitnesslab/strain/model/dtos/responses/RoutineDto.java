package com.fitnesslab.strain.model.dtos.responses;

import java.util.List;
import java.util.UUID;

public record RoutineDto(UUID id, String name, List<ExerciseDto> exercises,
                         Integer routineOrder, List<ExerciseSetDto> sets) { }

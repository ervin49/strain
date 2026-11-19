package com.fitnesslab.strain.model.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record WorkoutDto(UUID id, String routineName, int duration,
                         @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime date,
                         List<ExerciseDto> exercises, List<ExerciseSetDto> sets, Integer volume) { }

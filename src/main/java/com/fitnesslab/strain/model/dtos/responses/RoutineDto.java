package com.fitnesslab.strain.model.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoutineDto {
    private UUID id;
    private String name;
    private List<ExerciseDto> exercises;
}

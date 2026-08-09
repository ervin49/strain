package com.fitnesslab.strain.model.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ExerciseDto {
    private UUID id;
    private String name;
    private Set<MuscleDto> muscles;
}

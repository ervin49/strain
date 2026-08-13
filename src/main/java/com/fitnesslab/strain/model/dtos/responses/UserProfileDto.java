package com.fitnesslab.strain.model.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String email;
    private String firstName, lastName;
    private LocalDate dateOfBirth;
    private List<WorkoutDto> workouts;
    private List<RoutineDto> routines;
    private String avatarPath;
}

package com.fitnesslab.strain.model.dtos.responses;

import com.fitnesslab.strain.model.entity.Routine;
import com.fitnesslab.strain.model.entity.Workout;
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
    private List<Workout> workouts;
    private List<Routine> routines;
    private String avatarPath;
}

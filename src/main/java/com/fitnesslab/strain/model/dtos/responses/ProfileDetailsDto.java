package com.fitnesslab.strain.model.dtos.responses;

import com.fitnesslab.strain.model.entity.Routine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDetailsDto {
    private String email;
    private String firstName, lastName;
    private List<Routine> routines;
}

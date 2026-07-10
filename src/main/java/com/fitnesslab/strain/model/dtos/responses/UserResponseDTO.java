package com.fitnesslab.strain.model.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDTO {
    private String email;
    private String firstName;
    private String lastName;
}

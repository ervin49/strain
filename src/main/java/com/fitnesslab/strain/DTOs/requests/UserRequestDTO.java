package com.fitnesslab.strain.DTOs.requests;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserRequestDTO {
    private String email;
    private String password;
}

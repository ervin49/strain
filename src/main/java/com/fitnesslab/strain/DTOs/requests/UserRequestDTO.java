package com.fitnesslab.strain.DTOs.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserRequestDTO {
    private String email;
    private String password;
}

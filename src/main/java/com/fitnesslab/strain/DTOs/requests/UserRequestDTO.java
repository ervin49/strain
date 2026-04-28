package com.fitnesslab.strain.DTOs.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRequestDTO {
    private String email;
    private String password;
}

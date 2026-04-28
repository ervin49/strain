package com.fitnesslab.strain.DTOs.requests;

import com.fitnesslab.strain.Models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class UserRequestDTO {
    private String email;
    private String password;
}

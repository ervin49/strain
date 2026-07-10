package com.fitnesslab.strain.model.dtos.requests;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePassRequest {
    @Email(message = "Must be a valid email.")
    private String email;
    private String oldPassword;
    private String newPassword;
}

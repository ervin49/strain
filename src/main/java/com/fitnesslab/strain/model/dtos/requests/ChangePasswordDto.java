package com.fitnesslab.strain.model.dtos.requests;

import lombok.Data;

@Data
public class ChangePasswordDto {
    private String currentPassword;
    private String newPassword;
}

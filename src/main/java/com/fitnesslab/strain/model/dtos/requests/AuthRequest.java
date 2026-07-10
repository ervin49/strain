package com.fitnesslab.strain.model.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class AuthRequest {
    private String email;
    private String password;
}

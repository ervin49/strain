package com.fitnesslab.strain.DTOs.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateProfileRequest {
    private MultipartFile file;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
}

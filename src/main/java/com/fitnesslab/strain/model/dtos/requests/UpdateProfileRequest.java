package com.fitnesslab.strain.model.dtos.requests;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
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
    @Size(max = 100, message = "First name must be at most 100 characters.")
    private String firstName;
    @Size(max = 100, message = "Last name must be at most 100 characters.")
    private String lastName;
    @Past(message = "Date of birth must be in the past.")
    private LocalDate dateOfBirth;
}

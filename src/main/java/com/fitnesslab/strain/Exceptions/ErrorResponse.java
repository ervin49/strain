package com.fitnesslab.strain.Exceptions;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.Instant;

@Builder
@Data
public class ErrorResponse {
    private Instant timestamp;
    private String message;
    private String path;
    private HttpStatus error;
    private int statusCode;
}

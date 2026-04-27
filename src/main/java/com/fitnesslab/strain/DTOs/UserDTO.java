package com.fitnesslab.strain.DTOs;

import com.fitnesslab.strain.Models.User;

import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String email;

    public UserDTO(User user){
        this.id = user.getUserId();
        this.email = user.getEmail();
    }
}

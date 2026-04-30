package com.fitnesslab.strain;

import com.fitnesslab.strain.DTOs.responses.UserResponseDTO;
import com.fitnesslab.strain.Models.User;
import org.mapstruct.Mapper;

@Mapper
public interface UserMapper {
    UserResponseDTO toDTO(User user);
}

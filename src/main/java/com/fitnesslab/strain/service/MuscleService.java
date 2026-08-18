package com.fitnesslab.strain.service;

import com.fitnesslab.strain.model.entity.Muscle;
import com.fitnesslab.strain.repository.MuscleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class MuscleService {
    MuscleRepository muscleRepository;

    public List<Muscle> getAll(){
        return muscleRepository.findAll();
    }

    public Muscle create(Muscle muscle){
        return muscleRepository.save(muscle);
    }

    public void deleteById(UUID id){
        muscleRepository.deleteById(id);
    }
}

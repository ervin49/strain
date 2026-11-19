package com.fitnesslab.strain.model.mapper;

import com.fitnesslab.strain.exception.ResourceNotFoundException;
import com.fitnesslab.strain.model.dtos.requests.ExerciseRequestDto;
import com.fitnesslab.strain.model.dtos.requests.MuscleRequestDto;
import com.fitnesslab.strain.model.dtos.requests.RoutineRequestDto;
import com.fitnesslab.strain.model.dtos.requests.RoutineCreateRequestDto;
import com.fitnesslab.strain.model.dtos.requests.WorkoutRequestDto;
import com.fitnesslab.strain.model.dtos.responses.*;
import com.fitnesslab.strain.model.entity.*;
import com.fitnesslab.strain.repository.ExerciseRepository;
import com.fitnesslab.strain.repository.MuscleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ApiDtoMapper {
    private final ExerciseRepository exerciseRepository;
    private final MuscleRepository muscleRepository;

    public MuscleDto toDto(Muscle muscle) {
        return new MuscleDto(muscle.getId(), muscle.getName());
    }

    public ExerciseDto toDto(Exercise exercise) {
        return new ExerciseDto(
                exercise.getId(),
                exercise.getName(),
                exercise.getEquipment(),
                exercise.getPrimaryMuscle() == null ? null : toDto(exercise.getPrimaryMuscle()),
                exercise.getSecondaryMuscles() == null ? List.of() : exercise.getSecondaryMuscles().stream().map(this::toDto).toList()
        );
    }

    public ExerciseSetDto toDto(ExerciseSet set) {
        return new ExerciseSetDto(set.getId(), set.getSetNumber(), set.getWeight(), set.getReps(), set.getExerciseId());
    }

    public RoutineDto toDto(Routine routine) {
        return new RoutineDto(
                routine.getId(), routine.getName(),
                routine.getExercises() == null ? List.of() : routine.getExercises().stream().map(this::toDto).toList(),
                routine.getRoutineOrder(),
                routine.getSets() == null ? List.of() : routine.getSets().stream().map(this::toDto).toList()
        );
    }

    public WorkoutDto toDto(Workout workout) {
        return new WorkoutDto(
                workout.getId(), workout.getRoutineName(), workout.getDuration(), workout.getDate(),
                workout.getExercises() == null ? List.of() : workout.getExercises().stream().map(this::toDto).toList(),
                workout.getSets() == null ? List.of() : workout.getSets().stream().map(this::toDto).toList(),
                workout.getVolume()
        );
    }

    public UserProfileDto toDto(User user) {
        return new UserProfileDto(
                user.getEmail(), user.getFirstName(), user.getLastName(), user.getDateOfBirth(),
                user.getWorkouts() == null ? List.of() : user.getWorkouts().stream().map(this::toDto).toList(),
                user.getRoutines() == null ? List.of() : user.getRoutines().stream().map(this::toDto).toList(),
                user.getAvatarPath()
        );
    }

    public Muscle toEntity(MuscleRequestDto dto) {
        return Muscle.builder().name(dto.name()).build();
    }

    public Exercise toEntity(ExerciseRequestDto dto) {
        Exercise exercise = new Exercise();
        exercise.setName(dto.name());
        exercise.setEquipment(dto.equipment());
        exercise.setPrimaryMuscle(dto.primaryMuscle() == null ? null : muscleRepository.findById(dto.primaryMuscle().id())
                .orElseThrow(() -> new ResourceNotFoundException("Muscle not found")));
        exercise.setSecondaryMuscles(dto.secondaryMuscles() == null ? List.of() : dto.secondaryMuscles().stream()
                .map(muscle -> muscleRepository.findById(muscle.id()).orElseThrow(() -> new ResourceNotFoundException("Muscle not found")))
                .toList());
        return exercise;
    }

    public Routine toEntity(RoutineRequestDto dto) {
        Routine routine = new Routine();
        routine.setName(dto.name());
        routine.setExercises(dto.exercises() == null ? null : dto.exercises().stream().map(this::toExerciseReference).toList());
        routine.setSets(dto.sets() == null ? null : dto.sets().stream().map(this::toEntity).toList());
        return routine;
    }

    public Routine toEntity(RoutineCreateRequestDto dto) {
        return toEntity(new RoutineRequestDto(dto.name(), dto.exercises(), dto.sets()));
    }

    public Workout toEntity(WorkoutRequestDto dto) {
        Workout workout = new Workout();
        workout.setRoutineName(dto.routineName());
        workout.setDuration(dto.duration());
        workout.setVolume(dto.volume());
        workout.setExercises(dto.exercises() == null ? List.of() : dto.exercises().stream().map(this::toExerciseReference).toList());
        workout.setSets(dto.sets() == null ? List.of() : dto.sets().stream().map(this::toEntity).toList());
        return workout;
    }

    private Exercise toExerciseReference(ExerciseDto dto) {
        if (dto.id() == null) {
            throw new ResourceNotFoundException("Exercise not found");
        }
        return exerciseRepository.findById(dto.id())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
    }

    private ExerciseSet toEntity(ExerciseSetDto dto) {
        return ExerciseSet.builder()
                .id(dto.id())
                .setNumber(dto.setNumber())
                .weight(dto.weight())
                .reps(dto.reps())
                .exerciseId(dto.exerciseId())
                .build();
    }
}

import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api} from "../constants/axios.tsx";
import {useUser, type Exercise, type Workout} from "../components/UserProvider.tsx";
import Sidebar from "../components/Sidebar.tsx";
import {convertMS, displayTime} from "../constants/time.tsx";

export default function WorkoutPage() {
    const {workoutId} = useParams();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const {user, loading} = useUser();

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const result = await api.get(`/workouts/${workoutId}`);
                setWorkout(result.data);
                setExercises(result.data.exercises);
            } catch (e) {
                console.log(e);
            }
        };

        fetchWorkout();
    }, [workoutId]);

    if (loading || !user || !workout) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-black">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black text-white">
            <Sidebar/>
            <div className="flex-grow-1 d-flex pt-4 justify-content-center">
            <div className="p-3  rounded-4" style={{ backgroundColor: '#161618', width: 627}}>
                <div className="d-flex">
                    <img
                        src={
                            user.avatarPath
                                ? `http://192.168.1.200:8080/user-images/${user.avatarPath}`
                                : '/src/assets/default-profile-picture.png'
                        }
                        style={{width: 50, height: 50}}
                        className="rounded-circle"
                        alt="profile-picture"
                    />

                    <div className="ms-3 d-flex flex-column">
                        <span>{user.firstName}</span>
                        <span className="small text-secondary">
                            {convertMS(new Date().getTime() - new Date(workout.date).getTime()).toString()}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <span>{workout.routineName}</span>

                    <div className="d-flex gap-5 mt-3">
                        <div className="d-flex flex-column">
                            <span className="small text-secondary">Time</span>
                            <span>{displayTime(workout.duration)}</span>
                        </div>

                        <div className="d-flex flex-column">
                            <span className="small text-secondary">Volume</span>
                            <span>{workout.volume ?? "0"} kg</span>
                        </div>

                        <div className="d-flex flex-column">
                            <span className="small text-secondary">Sets</span>
                            <span>{workout.sets.length}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3" style={{ height: 1, backgroundColor: '#2C2C2E'}}/>

                <div className="flex-grow-1 d-flex mt-5">
                    <div className="w-100">
                        {exercises.map((exercise) => (
                            <div className="mb-5" key={exercise.id}>
                            <span className="fw-bold">
                                {exercise.name}
                            </span>

                                <div className="d-flex  gap-4 ps-3 mt-4">
                                <span
                                    className="small text-center text-secondary"
                                    style={{width: 32}}
                                >
                                    SET
                                </span>

                                    <span className="small text-secondary">
                                    WEIGHT & REPS
                                </span>
                                </div>

                                {workout.sets
                                    .filter((set) => set.exerciseId === exercise.id)
                                    .map((set) => (
                                        <div
                                            key={set.id}
                                            className={`d-flex align-items-center gap-4 p-3 ${
                                                set.setNumber % 2 === 0
                                                    ? "bg-dark rounded-4"
                                                    : ""
                                            }`}
                                        >
                                        <span
                                            style={{width: 32}}
                                            className="text-center"
                                        >
                                            {set.setNumber}
                                        </span>

                                            <span>
                                            {set.weight ?? "0"}kg x {set.reps ?? "0"} reps
                                        </span>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

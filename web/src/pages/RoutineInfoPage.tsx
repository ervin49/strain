import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api} from "../constants/axios.tsx";
import type {Exercise, ExerciseSet, Routine} from "../components/UserProvider.tsx";
import Sidebar from "../components/Sidebar.tsx";
import {ArrowLeft} from "lucide-react";

export default function RoutineInfoPage(){
    const {routineId} = useParams()
    const [routine, setRoutine] = useState<Routine>()
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRoutine = async () => {
            try{
                const result = await api.get(`/routines/${routineId}`)
                setRoutine(result.data)
                setExercises(result.data.exercises)
                setExerciseSets(result.data.sets)
            } catch (e) {
                console.log(e);
            }
        }

        fetchRoutine()
    }, []);

    if(!routine){
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-black">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black text-white">
            <Sidebar/>
            <div className="flex-grow-1 d-flex pt-4 justify-content-center">
                <div>
                    <button
                        className="bg-transparent border-0"
                        onClick={() => navigate("/routines")}
                    >
                        <ArrowLeft/>
                    </button>
                    <span className="fw-bold"
                          style={{ fontSize: 24}}
                    >
                        {routine.name}
                    </span>
                    <div className="p-3  rounded-4" style={{ backgroundColor: '#161618', width: 627}}>
                        <div className="mt-4">


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

                                            {exerciseSets
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
            </div>
        </div>
    )
}
import {createContext, type ReactNode, useContext, useEffect, useRef, useState} from "react";
import {api} from "@/constants/axios";

export interface Muscle {
    id: string;
    name: string;
}

export interface ExerciseSet {
    id?: string;
    setNumber: number;
    weight: string | undefined;
    reps: string | undefined;
    exerciseId: string | undefined
}

export interface Exercise {
    id: string;
    name: string;
    equipment: string;
    primaryMuscle: Muscle;
    secondaryMuscles: Muscle[];
}

export interface Workout {
    id: string;
    routineName: string;
    duration: number;
    date: Date;
    exercises: Exercise[];
    sets: ExerciseSet[];
    volume: number;
}

export interface Routine {
    id: string;
    name: string;
    exercises: Exercise[];
    routineOrder: number;
    sets: ExerciseSet[];
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    workouts: Workout[];
    routines: Routine[];
    avatarPath: string;
}

export interface WorkoutInProgress {
    routineName: string;
    duration: number;
    exercises: Exercise[];
    sets: ExerciseSet[];
    finishedSets: ExerciseSet[];
    volume: number;
}

export interface UserContextType{
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    loading: boolean;
    refreshUser: () => Promise<void>;
    workoutInProgress: WorkoutInProgress | null;
    setWorkoutInProgress: (workout: WorkoutInProgress | null) => void;
    startTime: () => void;
    duration: number;
    stopTime: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({children} : {children: ReactNode}): ReactNode {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [workoutInProgress, setWorkoutInProgress] = useState<WorkoutInProgress | null>(null)
    const startTimeRef = useRef(0)
    const intervalRef = useRef<number | null>(null);
    const [duration, setDuration] = useState(0)

    const startTime = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
        }

        startTimeRef.current = Date.now() - duration * 1000
        intervalRef.current = setInterval(() => setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000)),1000)
    }

    const stopTime = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            setDuration(0)
        }
    }

    const refreshUser = async () => {
        try {
            const response = await api.get("/my-details");
            setUser(response.data);
        } catch (err: any) {
            console.log(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{
            user, setUser, loading, refreshUser,
            workoutInProgress, setWorkoutInProgress, startTime, duration, stopTime
        }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}
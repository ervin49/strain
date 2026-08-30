import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {api} from "@/constants/axios";

export interface Muscle {
    id: string;
    name: string;
}

export interface ExerciseSet {
    id: string;
    setNumber: number;
    reps: number;
    weight: number;
}

export interface Exercise {
    id: string;
    name: string;
    muscles: Muscle[];
    sets: ExerciseSet[];
}

export interface Workout {
    id: string;
    date: string;
    notes: string;
    durationMinutes: number;
    exercises: Exercise[];
}

export interface Routine {
    id: string;
    date: string;
    notes: string;
    exercises: Exercise[];
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

export interface UserContextType{
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({children} : {children: ReactNode}): ReactNode {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshUser = async () => {
        try {
            const response = await api.get("/my-details");
            setUser(response.data);
            console.log(response.data);
        } catch (err: any) {
            console.error(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser}}>
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
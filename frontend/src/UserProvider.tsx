import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {api} from "./axios.tsx";
import defaultAvatar from "./assets/default-profile-picture.png";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    routines: string[];
    avatarPath: string;
}

interface UserContextType{
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
        } catch (err) {
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
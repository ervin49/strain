import Sidebar from "../components/Sidebar.tsx";
import {useEffect, useState} from "react";
import {api} from "../axios.tsx";
import { useUser } from "../UserProvider.tsx";

export default function ProfilePage() {
    const { user } = useUser();
    const avatarPath = user?.avatarPath;
    const firstName= user?.firstName;
    const lastName= user?.lastName;
    useEffect(() => {
        document.title = "Strain - Profile";
    }, []);

    return (
        <>
            <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                <Sidebar/>
                <div className="flex-grow-1 d-flex align-items-center flex-column">
                    <div className="w-100 p-4 rounded mt-3"
                         style={{ maxWidth: 1024, backgroundColor: "#161819"}}
                    >
                    </div>
                    <button></button>
                </div>
            </div>
        </>
    )
};
import Sidebar from "../components/Sidebar.tsx";
import {useEffect} from "react";

export default function RoutinesPage() {
    useEffect((): void => {
        document.title = "Strain - Routines";
    }, []);

    return (
        <>
        <div className="">
            <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                <Sidebar/>
            </div>
        </div>
        </>
    )
}
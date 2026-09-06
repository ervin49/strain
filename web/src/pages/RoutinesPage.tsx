import Sidebar from "../components/Sidebar.tsx";
import {useEffect} from "react";
import {useUser} from "../components/UserProvider.tsx";

export default function RoutinesPage() {
    const { user } = useUser();
    const routines = user?.routines || [];
    const noOfRoutines = routines.length;

    useEffect((): void => {
        document.title = "Strain - Routines";

    }, []);

    return (
        <>
            <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                <Sidebar/>
                <div className="flex-grow-1 d-flex justify-content-center">
                    {noOfRoutines === 0 &&
                        <div>
                            <h4 className="mt-4 mb-3">Routines</h4>
                            <div className="rounded-4 mt-1 d-flex justify-content-center align-items-center"
                                 style={{ width: 642, height: "60vh", backgroundColor: "#111313"}}>
                                <div>
                                    <div className="d-flex justify-content-center">
                                        <img src="/src/assets/dumbbell.png" alt="dumbbell"/>
                                    </div>
                                    <h6 className="mt-3 d-flex justify-content-center">Get started</h6>
                                    <p className="text-muted" style={{ fontSize: 14}}>Start by creating a routine!</p>
                                </div>
                            </div>
                        </div>
                    }
                    <div style={{
                        width: 360, height: 96, marginTop: 70, backgroundColor: "#111313"
                    }}
                         className="rounded-4 ms-4 d-flex align-items-center">
                        <button className="btn d-flex justify-content-between ms-3" style={{ width: "90%"}}>
                            <div className="d-flex">
                                <div className="rounded-4 bg-black d-flex justify-content-center align-items-center" style={{ width: 48, height: 48}}>
                                    <img src="/src/assets/sidebar-icons/routines.png" alt="routine"
                                         width={18} height={22}/>
                                </div>
                                <span className="ms-3" style={{ marginTop: 12}}>New Routine</span>
                            </div>
                            <img src="/src/assets/right-arrow.png" alt="arrow"
                                 style={{ marginTop: 12 }}
                                 height={26} width={26}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
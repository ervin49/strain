import Sidebar from "../components/Sidebar.tsx";
import {useEffect, useState} from "react";
import {type Routine, useUser} from "../components/UserProvider.tsx";
import {isSortable, useSortable} from "@dnd-kit/react/sortable";
import {DragDropProvider} from "@dnd-kit/react";
import {api} from "../constants/axios.tsx";
import {Link} from "react-router-dom";

function Sortable({item,id, index}: {item: Routine, id: string, index: number}) {
    const {ref} = useSortable({id, index});
    const exercises = item.exercises.map((ex, i) => {
        let name = ex.name
        if(i < item.exercises.length - 1){
            name += ', '
        }

        return name
    })


    return (
        <div ref={ref} className="rounded-4 px-4 py-4 mb-3"
             style={{ width: 642, backgroundColor: "#111313"}}>
            <div>
                <div className="fw-bold">{item.name}</div>
                <span className="text-truncate d-block text-muted small mt-2">{exercises}</span>
            </div>
        </div>
    );
}

export default function RoutinesPage() {
    const { user } = useUser();
    const [routines, setRoutines] = useState(user?.routines || [])
    const noOfRoutines = routines.length;
    const {refreshUser} = useUser()

    const onOrder = async (event) => {
        if (event.canceled) return;

        const {source} = event.operation;

        if (!isSortable(source)) return;

        const {initialIndex, index} = source;

        if (initialIndex === index) return;

        const newRoutines = [...routines];
        const [item] = newRoutines.splice(initialIndex, 1);
        newRoutines.splice(index, 0, item);

        setRoutines(newRoutines);

        try {
            await api.put("/routines", newRoutines.map(r => r.id));
            await refreshUser();
        } catch (e) {
            console.log(e);
        }
    };

    useEffect((): void => {
        document.title = "Strain - Routines";
    }, []);

    useEffect((): void => {
        setRoutines(user?.routines ?? [])
    }, [user]);

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
            <div className="flex-grow-1 d-flex justify-content-center">
                <div>
                    <h4 className="mt-4 mb-3">Routines</h4>
                    {noOfRoutines === 0 &&
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
                    }
                    {noOfRoutines > 0 &&
                        <DragDropProvider onDragEnd={onOrder}>
                            <ul>
                                {routines.map((item,index) => (
                                    <Sortable item={item} key={item.id} id={item.id} index={index}/>
                                ))}
                            </ul>
                        </DragDropProvider>
                    }
                </div>
                <div style={{
                    width: 360, height: 96, marginTop: 70, backgroundColor: "#111313"
                }}
                     className="rounded-4 ms-4 d-flex align-items-center">
                    <Link
                        to="/routines/new"
                        className="btn d-flex justify-content-between ms-3"
                        style={{ width: "90%"}}
                    >
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
                    </Link>
                </div>
            </div>
        </div>
    )
}
import Sidebar from "../components/Sidebar";
import {useEffect, useState} from "react";
import { useUser } from "../UserProvider";
import { Link } from "react-router-dom";

export default function DashboardPage() {
    const { user } = useUser();
    const firstName = user?.firstName
    const lastName = user?.lastName
    const noOfWorkouts = user?.workouts?.length;
    const avatarPath = user?.avatarPath
    useEffect((): void => {
        document.title = "Strain";
    }, []);

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
            <div className="flex-grow-1 d-flex justify-content-center">
                <div>
                    <h3 className="mt-4">Home</h3>
                    { noOfWorkouts === 0 &&
                        <div className="w-100 p-4 rounded-4 mt-1"
                             style={{ maxWidth: 684, height:274, backgroundColor: "#111313"}}>
                            You don't have any workouts uploaded yet! Upload your first workout now.
                        </div>
                    }
                </div>
                <div className="w-100 p-4 rounded-4 ms-3 mt-4 d-lex justify-content-center"
                     style={{ maxWidth: 330, height:385, backgroundColor: "#111313"}}>
                    <img src={avatarPath ? `http://localhost:8080/user-images/${avatarPath}` : `/src/assets/default-profile-picture.png`}
                         alt="profile picture" className="rounded-circle"
                         width={64} height={64}/>
                    <div className="">
                        <span>{firstName} {lastName}</span>
                        <p className="text-muted" style={{ fontSize: 12}}>{firstName}</p>
                    </div>
                    <div className="d-flex justify-content-between ps-4 pe-4">
                        <div>
                            <span className="text-muted" style={{ fontSize: 12}}>Workouts</span>
                            <p>{noOfWorkouts}</p>
                        </div>
                        <div>
                            <span className="text-muted" style={{ fontSize: 12}}>Workouts</span>
                            <p>{noOfWorkouts}</p>
                        </div>
                        <div>
                            <span className="text-muted" style={{ fontSize: 12}}>Workouts</span>
                            <p>{noOfWorkouts}</p>
                        </div>
                    </div>
                    <Link to="/profile" className="btn w-100 rounded-3" style={{ backgroundColor: "#2a2e2f"}}>See your profile</Link>
                    <br></br>
                </div>
            </div>
        </div>
    )
}
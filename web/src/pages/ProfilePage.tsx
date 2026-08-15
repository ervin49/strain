import Sidebar from "../components/Sidebar.tsx";
import {useEffect, useState} from "react";
import {api} from "../axios.tsx";
import { useUser } from "../UserProvider.tsx";
import {Link} from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../assets/styles/calendar.css'

export default function ProfilePage() {
    const { user } = useUser();
    const avatarPath = user?.avatarPath;
    const firstName= user?.firstName;
    const lastName= user?.lastName;
    const noOfWorkouts = user?.workouts?.length || 0;
    const workouts = user?.workouts || [];

    useEffect(() => {
        document.title = "Strain - Profile";
    }, []);

    let duration = 0;
    for(let i = 0; i < noOfWorkouts; i++){
        duration += workouts[i].durationMinutes;
    }

    return (
        <>
            <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                <Sidebar/>
                <div className="flex-grow-1 d-flex align-items-center flex-column">
                    <div className="w-100 p-4 rounded-4 mt-3"
                         style={{ maxWidth: 1024, height:274, backgroundColor: "#111313"}}
                    >
                        <div>
                            <img src={avatarPath ? `http://localhost:8080/user-images/${avatarPath}` : `/src/assets/default-profile-picture.png`} alt="profile picture"
                                 width={104}
                                 height={104}
                                 className="rounded-circle"
                            />
                        </div>
                        <div className="mt-3 d-flex">
                            <div>
                                <span style={{ fontSize: 22 }} className="fw-bold">{firstName} {lastName}</span>
                                <p style={{ fontSize: 15, top: -3 }} className="text-muted position-relative">{firstName}</p>
                            </div>
                            <Link to="/settings" className="btn rounded-3 mt-2 h-75" style={{backgroundColor: "#2a2e2f", marginLeft: 80}}>Edit Profile</Link>
                        </div>
                        <div className="d-flex position-relative" style={{ top: -10}}>
                            <div>
                                <span className="text-muted" style={{fontSize: 11}}>Workouts</span>
                                <p className="position-relative" style={{ top: -5}}>{noOfWorkouts}</p>
                            </div>
                            <div style={{ marginLeft: 41}}>
                                <span className="text-muted" style={{fontSize: 11}}>Followers</span>
                                <p className="position-relative" style={{ top: -5}}>0</p>
                            </div>
                            <div style={{ marginLeft: 41}}>
                                <span className="text-muted" style={{fontSize: 11}}>Following</span>
                                <p className="position-relative" style={{ top: -5}}>0</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-4">
                        <div className="rounded-4 mt-4 p-4"
                             style={{ width: 625, height: 360, backgroundColor: "#111313"}}
                        >
                            <span style={{ fontSize: 16 }} className="fw-bold">Statistics</span>
                            <p className="mt-4 position-relative" style={{ left: -10}}>Duration</p>
                            <div className="position-relative w-100" style={{ left: -20, height: 1, backgroundColor: "#2C2C2E"}}/>
                            <div className="d-flex mt-3">
                                <p style={{ fontSize: 25 }}>{duration}m</p>
                                <span style={{ fontSize: 12, bottom: -15 }} className="text-muted ms-2 position-relative">This week</span>
                            </div>
                        </div>
                        <div className="rounded-4 mt-4 p-4"
                             style={{ width: 375,  backgroundColor: "#111313"}}
                        >
                            <span style={{ fontSize: 16 }} className="fw-bold">Calendar</span>
                            <Calendar formatShortWeekday={(locale, date) => {
                                return date.toLocaleDateString(locale, { weekday: 'short'}).charAt(0)
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
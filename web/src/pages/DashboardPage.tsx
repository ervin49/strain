import Sidebar from "../components/Sidebar";
import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {useUser, type Workout} from "../components/UserProvider.tsx";
import {convertMS, displayTime} from "../constants/time.tsx";

export default function DashboardPage() {
    const { user, loading } = useUser();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [workouts, setWorkouts] = useState<Workout[]>([])

    useEffect((): void => {
        document.title = "Strain";
    }, []);

    useEffect(() => {
        if(user) {
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setWorkouts(user.workouts)
        }
    }, [user]);

    if (loading || !user) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-black">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
            <div className="flex-grow-1 d-flex justify-content-center">
                <div>
                    <h4 className="mt-4 mb-3">Home</h4>
                    <div>
                        {workouts.length === 0 ? (
                            <div className="rounded-4 mt-1"
                                 style={{ width: 684, height:274, backgroundColor: "#111313"}}>
                                <div style={{ height: 216, backgroundColor: "#2C2C2E", fontWeight: 500 }} className="rounded-top-4 d-flex">
                                    <div style={{ height: 216, width: 400 }} className="p-5 mt-2">
                                        <span style={{ fontSize: 20 }}>Hello </span>
                                        <span style={{ color: "#008CFF", fontSize: 20 }}>{firstName}</span>
                                        <span style={{ fontSize: 20 }}>, welcome to Strain!</span>
                                        <p style={{ fontSize: 14}} className="mt-2">To take full advantage of Strain complete the following steps:</p>
                                    </div>
                                    <img src="/src/assets/phone.png" alt="image"
                                         className="position-relative mt-4" style={{ left: -12 }}/>
                                </div>
                                <div style={{ height: 382, backgroundColor: "#111313"}} className="rounded-4">
                                    <div style={{ height: 144, width: 350 }} className="d-flex align-items-center ps-5 mt-4">
                                        <div style={{ width: 80}}>
                                            <img src="/src/assets/download.png" alt="download"/>
                                        </div>
                                        <p className="ms-4 mt-3">Download the Strain mobile app</p>
                                    </div>
                                    <div style={{ height: 1, backgroundColor: "#2C2C2E" }} className="ms-5 me-5"/>
                                    <div style={{ height: 114}} className="d-flex align-items-center ps-5">
                                        <div style={{ width: 80}}>
                                            <img src="/src/assets/profile.png" alt="profile"/>
                                        </div>
                                        <div className="pt-4 ms-3">
                                            <p>Log in with the account you just created</p>
                                            <p className="position-relative" style={{ top: -15}}>Make sure you tap on "Already have an account? Login" button</p>
                                        </div>
                                    </div>
                                    <div style={{ height: 1, backgroundColor: "#2C2C2E" }} className="ms-5 me-5"/>
                                    <div style={{ height: 114}} className="d-flex align-items-center ps-5">
                                        <div style={{ width: 80}}>
                                            <img src="/src/assets/workout.png" alt="workout"/>
                                        </div>
                                        <div className="pt-4 ms-3">
                                            <p>Log your first workout with the Strain App</p>
                                            <p className="position-relative" style={{ top: -15 }}>Enjoy access to Strain on both your phone and the web app</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            [...workouts].reverse().map((workout) =>
                                <div className="mb-3">
                                    <div className="rounded-4 mt-1 p-4"
                                         style={{ width: 684, backgroundColor: "#111313"}}>
                                        <Link
                                            to="/profile"
                                            style={{ textDecoration: 'none', color: 'white'}}
                                        >
                                        <div className="d-flex mb-3">
                                            <img src={user.avatarPath ? `http://192.168.1.200:8080/user-images/${user.avatarPath}` :
                                                '/src/assets/default-profile-picture.png'}
                                                 width={48} height={48}
                                            />
                                            <div className="ms-3">
                                                <span>{firstName}</span>
                                                <span
                                                    className="d-flex text-muted small mt-1 justify-content-center position-relative" style={{ top: -3 }}>
                                                    {convertMS(new Date().getTime() - new Date(workout.date).getTime())}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link
                                        to={`/workout/${workout.id}`}
                                        style={{ textDecoration: 'none', color: 'white' }}>
                                        <div onClick={() => console.log('a mers')}>
                                            <span className="fw-bold">{workout.routineName}</span>
                                        </div>
                                        <div className="d-flex gap-4 mt-2">
                                            <div>
                                                <span className="text-muted" style={{ fontSize: 11}}>Duration</span>
                                                <span className="d-flex position-relative" style={{ top: -3 }}>{displayTime(workout.duration)}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted" style={{ fontSize: 11}}>Volume</span>
                                                <span className="d-flex position-relative" style={{ top: -3 }}>{workout.volume} kg</span>
                                            </div>
                                        </div>
                                        <div className="mt-3" style={{ height: 1, backgroundColor: '#2C2C2E'}}/>
                                        {workout.exercises.slice(0,3).map((exercise) =>
                                            {
                                                const noOfSets = workout.sets.filter(
                                                    (set) => set.exerciseId === exercise.id
                                                ).length

                                                return (
                                                    <div className="mt-1 ms-2">{noOfSets} {noOfSets === 1 ? 'set' : 'sets'} {exercise.name}</div>
                                                )
                                            }
                                        )}
                                    </Link>
                                </div>
                            </div>
                            )
                            )}
                    </div>
                </div>
                <div className="w-100  p-4 rounded-4 ms-3 mt-4"
                     style={{ maxWidth: 330, height:245, backgroundColor: "#111313"}}>
                    <div className="d-flex justify-content-center">
                        <div>
                            <div className="d-flex justify-content-center">
                                <img src={
                                         user?.avatarPath ?
                                             `http://localhost:8080/user-images/${user.avatarPath}` :
                                             `/src/assets/default-profile-picture.png`
                                     }
                                     alt="profile"
                                     className="rounded-circle"
                                     width={64} height={64}/>
                            </div>
                            <div className="mt-2">
                                <span style={{ fontWeight: 600}}>{firstName} {lastName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between ps-4 pe-4 mt-2">
                        <div>
                            <span className="text-muted" style={{ fontSize: 11}}>Workouts</span>
                            <p className="d-flex justify-content-center position-relative" style={{ top: -3 }}>{workouts.length}</p>
                        </div>
                        <div>
                            <span className="text-muted" style={{ fontSize: 11}}>Followers</span>
                            <p className="d-flex justify-content-center position-relative" style={{ top: -3 }}>0</p>
                        </div>
                        <div>
                            <span className="text-muted" style={{ fontSize: 11}}>Following</span>
                            <p className="d-flex justify-content-center position-relative" style={{ top: -3 }}>0</p>
                        </div>
                    </div>
                    <Link to="/profile" className="btn w-100 rounded-3" style={{ backgroundColor: "#2a2e2f"}}>See your profile</Link>
                    <br></br>
                </div>
            </div>
        </div>
    )
}
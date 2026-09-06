import Sidebar from "../components/Sidebar";
import {useEffect} from "react";
import { Link } from "react-router-dom";
import {useUser} from "../components/UserProvider.tsx";

export default function DashboardPage() {
    const { user } = useUser();
    const firstName = user?.firstName
    const lastName = user?.lastName
    const noOfWorkouts = user?.workouts?.length || 0;
    const workouts = user?.workouts;
    const avatarPath = user?.avatarPath
    useEffect((): void => {
        document.title = "Strain";
    }, []);

    const resultWorkouts: any[] = [];
    if (workouts) {
        for(let i = 0; i < noOfWorkouts; i++){
            const element = workouts[i];
            const exercises: any[] = []

            for(let j = 0; j < element.exercises.length; j++){
                exercises.push(
                    <h2>{element.exercises[j].name}</h2>
                    // to add muscles and sets
                )
            }
            resultWorkouts.push(
                <div className="card">
                    <h2>{element.date}</h2>
                    <h2>{element.notes ?? 'no notes'}</h2>
                    <h2>{`it lasted` + element.durationMinutes}</h2>
                    <h2>{exercises}</h2>
                </div>
            )
        }
    }

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
            <div className="flex-grow-1 d-flex justify-content-center">
                <div>
                    <h4 className="mt-4 mb-3">Home</h4>
                    { noOfWorkouts === 0 &&
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
                    }
                    { noOfWorkouts > 0 &&
                        <div className="rounded-4 mt-1"
                             style={{ width: 684, height:274, backgroundColor: "#111313"}}>
                            <div style={{ height: 216, backgroundColor: "#2C2C2E", fontWeight: 500}} className="p-5 rounded-4">
                                {resultWorkouts}
                            </div>
                        </div>
                    }
                </div>
                <div className="w-100 p-4 rounded-4 ms-3 mt-4"
                     style={{ maxWidth: 330, height:245, backgroundColor: "#111313"}}>
                    <div className="d-flex justify-content-center">
                        <div>
                            <div className="d-flex justify-content-center">
                                <img src={avatarPath ? `http://localhost:8080/user-images/${avatarPath}` : `/src/assets/default-profile-picture.png`}
                                     alt="profile" className="rounded-circle"
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
                            <p className="d-flex justify-content-center position-relative" style={{ top: -3 }}>{noOfWorkouts}</p>
                        </div>
                        <div>
                            <span className="text-muted" style={{ fontSize: 11}}>Workouts</span>
                            <p className="d-flex justify-content-center position-relative" style={{ top: -3 }}>0</p>
                        </div>
                        <div>
                            <span className="text-muted" style={{ fontSize: 11}}>Workouts</span>
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
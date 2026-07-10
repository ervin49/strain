import Sidebar from "../components/Sidebar.tsx";
import {useEffect} from "react";

export default function ProfilePage() {
    useEffect(() => {
        document.title = "Strain - Profile";
    }, []);

    return (
        <>
            <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                <Sidebar/>
                <div className="flex-grow-1 d-flex align-items-center flex-column justify-content-center p-3">
                    <div
                        id="form"
                        className="w-100 p-4 border-black rounded shadow"
                        style={{ maxWidth: 500, backgroundColor: "#161819", display: "none" }}
                    >
                        <form method="POST" encType="multipart/form-data">
                            <div className="d-flex justify-content-between">
                                <strong>Profile</strong>
                                <button
                                    className="btn btn-primary rounded-3"
                                    style={{ width: 150 }}
                                    type="submit"
                                >
                                    Save changes
                                </button>
                            </div>
                            <div className="mb-4 text-start">
                                <img width={100} height={100} alt="image" />
                                <label htmlFor="change-picture" className="btn rounded-3 bg-dark">
                                    Change Picture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="change-picture"
                                    style={{ display: "none" }}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="change-first-name" className="form-label small">
                                    First Name
                                </label>
                                <input id="change-first-name" className="form-control rounded-3" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="change-last-name" className="form-label small">
                                    Last Name
                                </label>
                                <input id="change-last-name" className="form-control rounded-3" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};
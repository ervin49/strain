import Sidebar from "../components/Sidebar.tsx";
import {Link} from "react-router-dom";
import {type ChangeEvent, type SyntheticEvent, useEffect, useState} from "react";
import axios from "axios";

export default function SettingsPage() {
    useEffect(() => {
        document.title = "Strain - Settings";
    });
    const [file, setFile] = useState<File | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString().split('T')[0]);
    const [successMessage, setSuccessMessage] = useState("");

    function handleFileChange(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files){
            setFile(e.target.files[0]);
        }
    }

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if(file) {
                formData.append("file", file);
            }
            formData.append("firstName",firstName);
            formData.append("lastName",lastName);
            formData.append("dateOfBirth",dateOfBirth);
            const response = await axios.post("http://localhost:8080/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setSuccessMessage("Your profile has been updated successfully!");
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                <Sidebar/>
                <div className="flex-grow-1 d-flex align-items-center flex-column justify-content-center">
                    {successMessage && <p>{successMessage}</p>}
                    <div
                        className="w-100 p-4 border-black rounded shadow"
                        style={{ maxWidth: 500, backgroundColor: "#161819" }}
                    >
                        <form
                            encType="multipart/form-data"
                            onSubmit={handleSubmit}
                        >
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
                                <img
                                    className="rounded-circle"
                                    id="image-upload"
                                    width={100}
                                    height={100}
                                    alt="image"
                                />
                                <label
                                    htmlFor="change-picture"
                                    className="btn rounded-3 bg-dark ms-3"
                                >
                                    Change Picture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="change-picture"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="change-first-name" className="form-label small">
                                    First Name
                                </label>
                                <input id="change-first-name" className="form-control rounded-3" onChange={e => setFirstName(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="change-last-name" className="form-label small">
                                    Last Name
                                </label>
                                <input id="change-last-name" className="form-control rounded-3" onChange={e => setLastName(e.target.value)}/>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="date-of-birth" className="form-label small">
                                    Date of birth
                                </label>
                                <input
                                    type="date"
                                    id="date-of-birth"
                                    className="form-control rounded-3"
                                    onChange={e => setDateOfBirth(e.target.value)}
                                />
                            </div>
                            <div>
                                <Link
                                    to="/settings/change-password"
                                    type="button"
                                    className="btn btn-secondary rounded-3"
                                >Change password</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};
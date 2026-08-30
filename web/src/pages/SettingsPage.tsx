import Sidebar from "../components/Sidebar.tsx";
import {Link} from "react-router-dom";
import {type ChangeEvent, type SyntheticEvent, useEffect, useState} from "react";
import {api} from "../constants/axios.tsx";
import {useUser} from "../../../mobile/components/UserProvider.tsx";
import defaultAvatar from "../assets/default-profile-picture.png"
import DeletePageModal from "../components/DeletePageModal.tsx";
import {Check, X} from "lucide-react";
import ChangePasswordModal from "../components/ChangePasswordModal.tsx";

export default function SettingsPage() {
    const {user, loading, refreshUser} = useUser();
    const [file, setFile] = useState<File | null>(null);
    const [firstName, setFirstName] = useState<string | undefined>("");
    const [lastName, setLastName] = useState<string | undefined>("");
    const avatarPath = user?.avatarPath;
    const [dateOfBirth, setDateOfBirth] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const [previewUrl, setPreviewUrl] = useState("");
    const imageSrc = previewUrl ? previewUrl : (avatarPath ? `http://localhost:8080/user-images/${avatarPath}` : defaultAvatar);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Strain - Settings";
    },[]);

    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage("");
        },2000);
    },[successMessage])

    useEffect(() => {
        if(user){
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setDateOfBirth(user.dateOfBirth || "");
        }
    },[user]);

    const isFirstNameChanged = firstName !== (user?.firstName || "");
    const isLastNameChanged = lastName !== (user?.lastName || "");
    const isDateOfBirthChanged = dateOfBirth !== (user?.dateOfBirth || "");
    const isFileSelected = file !== null;

    const edited = isFirstNameChanged || isLastNameChanged || isDateOfBirthChanged || isFileSelected;

    function handleFileChange(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files){
            setFile(e.target.files[0]);
            const objectUrl = URL.createObjectURL(e.target.files[0]);
            setPreviewUrl(objectUrl);
        }
    }

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        let error = false;
        e.preventDefault();
        if(!edited){
            return;
        }
        if(firstName?.length === 0){
            setErrorMessage("First name has to be at least one character long.");
            setTimeout(() => {setErrorMessage("")},2000);
            setFirstName(user?.firstName);
            error = true;
        }
        if(lastName?.length === 0){
            setErrorMessage("Last name has to be at least one character long.");
            setTimeout(() => {setErrorMessage("")},2000);
            setLastName(user?.lastName);
            error = true;
        }
        if(error){
            return;
        }
        try {
            const formData = new FormData();
            if(file) {
                formData.append("file", file);
                setFile(null);
            }
            formData.append("firstName", firstName ?? '');
            formData.append("lastName", lastName ?? '');
            formData.append("dateOfBirth", dateOfBirth ?? '');
            const response = await api.post("/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setSuccessMessage("Your profile has been updated successfully!");
            await refreshUser();
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    if(loading){
        return <div>Loading...</div>
    }

    return (
        <>
            {isDeleteModalOpen && <DeletePageModal onClose={() => setIsDeleteModalOpen(false)}/>}
            {isChangePassModalOpen && <ChangePasswordModal onClose={() => setIsChangePassModalOpen(false)}/>}
            <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                <Sidebar/>
                <div className="flex-grow-1 d-flex align-items-center flex-column justify-content-center">
                    {errorMessage &&
                        <p className="p-2 bg-danger bg-gradient rounded-3"><X/>{errorMessage}
                        </p>
                    }
                    {successMessage &&
                        <p className="p-2 bg-success bg-gradient rounded-3"><Check/>{successMessage}
                        </p>
                    }
                    <div
                        className="w-100 p-4 rounded-4"
                        style={{ maxWidth: 500, backgroundColor: "#161819" }}
                    >
                        <form
                            encType="multipart/form-data"
                            onSubmit={handleSubmit}
                        >
                            <div className="d-flex justify-content-between">
                                <strong>Profile</strong>
                                <button
                                    className={`btn rounded-3 ${ edited ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ width: 150 }}
                                    type="submit"
                                >
                                    Save changes
                                </button>
                            </div>
                            <div className="mb-4 text-start">
                                <img
                                    className="rounded-circle"
                                    src={imageSrc}
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
                                <input id="change-first-name" className="form-control rounded-3" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="change-last-name" className="form-label small">
                                    Last Name
                                </label>
                                <input id="change-last-name" className="form-control rounded-3" value={lastName}
                                       onChange={e => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="date-of-birth" className="form-label small">
                                    Date of birth
                                </label>
                                <input
                                    type="date"
                                    id="date-of-birth"
                                    className="form-control rounded-3"
                                    value={dateOfBirth}
                                    onChange={e => setDateOfBirth(e.target.value)}
                                />
                            </div>
                            <div className="justify-content-between d-flex">
                                <button
                                    onClick={() => setIsChangePassModalOpen(!isChangePassModalOpen)}
                                    className="btn btn-outline-secondary rounded-3">
                                    Change password
                                </button>
                                <button className="btn btn-outline-danger" onClick={e => {setIsDeleteModalOpen(!isDeleteModalOpen)}}>Delete account</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};
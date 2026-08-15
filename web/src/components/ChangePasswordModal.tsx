import { X } from "lucide-react";
import {api} from "../axios.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type {AxiosError} from "axios";

export default function ChangePasswordModal({onClose}) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const isValid = newPassword.trim() !== "" && newPassword === confirmPassword;
    const onConfirm = async () => {
        if(!isValid){
            return;
        }
        if(newPassword.length < 8){
            setErrorMessage("Password must be at least 8 characters long.")
            return;
        }
        try {
            const response = await api.post("/change-password", {
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            console.log("success: " + response.data)
            setSuccessMessage(response.data);

            setTimeout(() => {
                onClose();
            },2000);
        } catch (err: any){
            setErrorMessage(err.response?.data?.message || err.response?.data || "An unexpected error occured.");
            console.error(err);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        },2000)
    },[errorMessage, successMessage])

    return (
        <div className="position-fixed w-100 vh-100 d-flex justify-content-center align-items-center"
             style={{
                 backdropFilter: "blur(5px)",
                 backgroundColor: "rgba(0, 0, 0, 0.4)",
                 zIndex: 2000,
             }}>
            <div className="position-relative p-4"  style={{width: "100%", maxWidth: 500}}>
                <button onClick={onClose} className="position-absolute end-0 bg-transparent border-0" aria-label="Close"><X size={25}/></button>
                <div className="card p-4 align-itms-center mt-4">
                    {successMessage && <div className={"bg-success p-2"}>{successMessage}</div>}
                    {errorMessage && <div className={"bg-danger p-2"}>{errorMessage}</div>}
                    <h4 className="mb-2">Change password</h4>
                    <span className={"text-muted mb-4"}>Update your password to keep your account secure.</span>
                    <div>
                        <label htmlFor={"current-password"} className={"small form-label"}>Current password</label>
                        <input id={"current-password"} placeholder={"Current password"} className={"form-control"}
                               type={"password"}
                               onChange={(e) => {setCurrentPassword(e.target.value)}}></input>
                    </div>
                    <div className={"mt-3"}>
                        <label htmlFor={"new-password"} className={"small form-label"}>New password</label>
                        <input id={"new-password"} placeholder={"New password"} className={"form-control"}
                               type={"password"}
                               onChange={(e) => {setNewPassword(e.target.value)}}></input>
                    </div>
                    <div className={"mt-3"}>
                        <label htmlFor={"confirm-password"} className={"small form-label"}>Confirm password</label>
                        <input id={"confirm-password"} placeholder={"Confirm password"} className={"form-control"}
                               type={"password"}
                               onChange={(e) => {setConfirmPassword(e.target.value)}}></input>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <button className="mt-3 btn rounded" onClick={onClose}>Cancel</button>
                        <button className={`mt-3 btn ${ isValid ? 'btn-primary' : 'btn-secondary'} rounded`} onClick={onConfirm}>Reset password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

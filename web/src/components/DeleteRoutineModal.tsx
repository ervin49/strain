import { X } from "lucide-react";
import {api} from "../constants/axios.tsx";
import {useNavigate} from "react-router-dom";
import {useUser} from "./UserProvider.tsx";

export default function DeleteRoutineModal({onClose, routineId}) {
    const navigate = useNavigate();
    const {refreshUser} = useUser()
    const onDelete = async () => {
        try {
            await api.delete(`/routines/${routineId}`);
            await refreshUser()
        } catch (err){
            console.error(err);
        }
    }

    return (
        <div className="position-fixed w-100 vh-100 d-flex justify-content-center align-items-center"
             style={{
                 backdropFilter: "blur(5px)",
                 backgroundColor: "rgba(0, 0, 0, 0.4)",
                 zIndex: 2000,
             }}>
            <div className="position-relative p-4"  style={{width: "100%", maxWidth: 500}}>
                <button onClick={onClose} className="position-absolute end-0 bg-transparent border-0" aria-label="Close"><X size={25}/></button>
                <div className="card p-4 align-items-center mt-4">
                    <h4 className="mb-3">Confirm routine deletion</h4>
                    <span className="text-muted">Are you sure you want to delete this routine?</span>
                    <div className="d-flex gap-5 mt-2">
                        <button className="mt-3 btn rounded" onClick={onClose}>Cancel</button>
                        <button className="mt-3 btn btn-outline-danger rounded" onClick={() => {
                            onDelete()
                            onClose()
                        }}>Delete routine</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

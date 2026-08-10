import { X } from "lucide-react";

export default function Modal({onClose}) {
    return (
        <div
            className="d-flex justify-content-center align-items-center position-fixed vw-100 vh-100 modal-ackdrop bg-opacity-25 opacity-100"
        >
            <button onClick={onClose} className="align-self-end bg-transparent border-0"><X/></button>
            <div className="card p-4 d-flex align-items-center" style={{width: 400}}>
                <h4 className="mb-3">Confirm account deletion</h4>
                <>Are you sure you want to delete your account?</>
                <>This action cannot be reversed.</>
                <button className="btn btn-outline-danger rounded">Delete account</button>
            </div>
        </div>
    );
}
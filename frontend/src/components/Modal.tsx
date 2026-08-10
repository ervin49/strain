import { X } from "lucide-react";

export default function Modal({onClose}) {
    return (
        <div className="position-fixed vw-100 vh-100 d-block justify-content-center align-items-center"
             style={{
                 backdropFilter: "blur(5px)",
                 zIndex: 2000,
                 paddingTop: 400,
                 paddingLeft: 600
             }}>
            <button onClick={onClose} className="align-self-end w-75 bg-transparent border-0"><X/></button>
            <div className="card p-4 align-items-center " style={{width: 400, height: 200}}>
                <h4 className="mb-3">Confirm account deletion</h4>
                <span>Are you sure you want to delete your account?</span>
                <span>This action cannot be reversed.</span>
                <button className="mt-3 btn btn-outline-danger rounded">Delete account</button>
            </div>
        </div>
    );
}
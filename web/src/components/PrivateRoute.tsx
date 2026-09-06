import { useAuth } from "../AuthContext.tsx";
import { Navigate} from "react-router-dom";
import type {JSX} from "react";
import {api} from "../constants/axios.tsx";

const PrivateRoute = ({children} : {children: JSX.Element}) => {
    const { authenticated } = useAuth();

    if(!authenticated){
        api.get("/me").then((response) => {
                if (response.status === 400) {
                    return <Navigate to="/login" replace/>
                }
            });
    }
    return children;
}

export default PrivateRoute;
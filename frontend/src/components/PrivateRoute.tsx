import { useAuth } from "../AuthContext.tsx";
import { Navigate, Route } from "react-router-dom";
import type {JSX} from "react";

const PrivateRoute = ({children} : {children: JSX.Element}) => {
    const { authenticated } = useAuth();

    if(!authenticated){
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default PrivateRoute;
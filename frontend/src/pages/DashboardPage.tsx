import Sidebar from "../components/Sidebar";
import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import axios, {type AxiosResponse} from "axios";

export default function DashboardPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    useEffect((): void => {
        document.title = "Strain";
    }, []);
    axios.defaults.baseURL="http://localhost:8080";

    axios.get("/me").then((response:AxiosResponse) =>
        {
            console.log(response.data);
            setIsLoggedIn(response.status === 200);
        }
    ).catch((err) => {
        console.error(err);
    });

    if(isLoggedIn) {
        return (
            <>
                <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
                    <Sidebar/>
                </div>
            </>
        )
    }
    else {
        return <Navigate to="/login"/>
    }
}
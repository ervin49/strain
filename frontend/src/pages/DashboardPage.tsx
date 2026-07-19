import Sidebar from "../components/Sidebar";
import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import axios, {type AxiosResponse} from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

export default function DashboardPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    useEffect((): void => {
        document.title = "Strain";
        const getDetails = async () => {
            try {
                const response = await API.get("/me");
                console.log(response);
                setIsLoggedIn(response.status === 200);
            }catch (err) {
                console.error(err)
                setIsLoggedIn(false)
            }finally {
                setIsLoading(false)
            }
        }
        getDetails()
    }, []);

    if(isLoading) return null

    return isLoggedIn ? (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
        </div>
    ) : (
        <Navigate to="/login"/>
    );
}
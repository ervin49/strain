import Sidebar from "../components/Sidebar";
import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import axios, {type AxiosResponse} from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

export default function DashboardPage() {
    useEffect((): void => {
        document.title = "Strain";
    }, []);

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
        </div>
    )
}
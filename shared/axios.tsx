import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.1.187:8080",
    withCredentials: true,
    timeout: 5000
})
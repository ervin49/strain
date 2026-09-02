import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
    baseURL: "http://192.168.1.200:8080",
    withCredentials: true,
    timeout: 5000
});
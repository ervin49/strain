import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";

const baseURL = Platform.OS === "ios" ? "http://192.168.1.200:8080" : "http://10.0.2.2:8080";
export const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 5000
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
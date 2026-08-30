import {useAuth} from "../AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {api} from "../constants/axios.tsx";

export const Logout = () => {
    const {logout}  = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await api.post("/logout");
            }catch (err){
                console.error(err)
            }finally {
                logout();
                navigate("/login", { replace: true })
            }
        }

        performLogout();
    }, [logout,navigate]);

    return null;
}
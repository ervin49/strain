import {BrowserRouter, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import RoutinesPage from "./pages/RoutinesPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PrivateRoute from "./components/PrivateRoute.tsx";
import {Logout} from "./components/Logout.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard"/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/logout" element={<Logout/>} />
                <Route path="/dashboard"
                       element={
                           <PrivateRoute>
                               <DashboardPage/>
                           </PrivateRoute>
                       }
                />
                <Route path="/routines"
                       element={
                           <PrivateRoute>
                               <RoutinesPage/>
                           </PrivateRoute>
                       }
                />
                <Route path="/profile"
                       element={
                           <PrivateRoute>
                               <ProfilePage/>
                           </PrivateRoute>
                       }
                />
                <Route path="/settings"
                       element={
                           <PrivateRoute>
                               <SettingsPage/>
                           </PrivateRoute>
                       }
                />
            </Routes>
        </BrowserRouter>
    )
}

import {BrowserRouter, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import './App.css'
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import RoutinesPage from "./pages/RoutinesPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigate to="/dashboard"/>} />
              <Route path="/register" element={<RegisterPage/>} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/dashboard" element={<DashboardPage/>} />
              <Route path="/routines" element={<RoutinesPage/>} />
              <Route path="/profile" element={<ProfilePage/>} />
              <Route path="/settings" element={<SettingsPage/>} />
          </Routes>
      </BrowserRouter>
  )
}

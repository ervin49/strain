import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {AuthProvider} from "./AuthContext.tsx";
import UserProvider from "./components/UserProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <UserProvider>
                <App />
            </UserProvider>
        </AuthProvider>
    </StrictMode>
)

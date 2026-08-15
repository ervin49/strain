import {createContext, type ReactNode, useContext, useMemo, useState} from "react";

const AuthContext = createContext({
    authenticated: false,
    login: () => {},
    logout: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children } : {children: ReactNode} ) => {
    const [authenticated, setAuthenticated] = useState(false)

    const login = () => setAuthenticated(true)
    const logout = () => setAuthenticated(false)

    const contextValue = useMemo(() => ({
        authenticated,
            login,
            logout
    }), [authenticated])

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
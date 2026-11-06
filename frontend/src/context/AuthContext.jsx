import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export function AuthProvider({ children}) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem("usuario");
        return guardado ? JSON.parse(guardado) : null;
    });

    // Si el backend responde 401 (token vencido), apiClient avisa y cerramos la sesion
    useEffect(() => {
        const alExpirar = () => setUsuario(null);
        window.addEventListener("sesion-expirada", alExpirar);
        return () => window.removeEventListener("sesion-expirada", alExpirar);
    }, []);

    const login = (datosUsuario) => {
        setUsuario(datosUsuario);
        localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    };
    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
    };

    return(
        <AuthContext.Provider value={{ usuario, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }
    return context;
}
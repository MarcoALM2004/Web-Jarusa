import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sin sesion -> /login (y vuelve aqui al ingresar). Con soloAdmin, un cliente va al inicio.
function RutaProtegida({ soloAdmin = false }) {
    const { usuario } = useAuth();
    const location = useLocation();

    if (!usuario) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    if (soloAdmin && usuario.rol !== "ADMIN") {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default RutaProtegida;

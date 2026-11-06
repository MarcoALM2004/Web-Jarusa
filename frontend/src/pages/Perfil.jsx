import { useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";

import "../styles/Perfil.css";

function Perfil() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!usuario) return null; // RutaProtegida ya redirige a /login

    const tarjetaPerfil = (
        <div className="perfil-card">
            <div className="perfil-icono">
                <CircleUserRound size={64} />
            </div>

            <h1>{usuario.nombre}</h1>
            <p className="perfil-email">{usuario.email}</p>
            <span className="perfil-rol">{usuario.rol}</span>

            <button className="perfil-logout" onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );

    if (usuario.rol === "ADMIN") {
        return (
            <AdminLayout>
                <main className="perfil-page">{tarjetaPerfil}</main>
            </AdminLayout>
        );
    }

    return (
        <>
            <Header />
            <main className="perfil-page">{tarjetaPerfil}</main>
            <Footer />
        </>
    );
}

export default Perfil;

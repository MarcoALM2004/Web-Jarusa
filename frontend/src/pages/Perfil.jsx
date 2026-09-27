import { useNavigate } from "react-router-dom";
import { CircleUserRound, Home, ShoppingBag, ClipboardList, Users } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import "../styles/Perfil.css";
import "../styles/Administrador.css";

function Perfil() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!usuario) {
        navigate("/login");
        return null;
    }

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
        <div className="admin-layout">
            <aside className="admin-sidebar">
            <div className="admin-logo">
                <img src="/img/Marca.png" alt="Jarusa" />
            </div>

            <nav className="admin-nav">
                <a href="/administrador" className="admin-nav-item">
                <Home size={18} /> Inicio
                </a>
                <a href="/productos" className="admin-nav-item">
                <ShoppingBag size={18} /> Productos
                </a>
                <a href="#" className="admin-nav-item">
                <ClipboardList size={18} /> Pedidos
                </a>
                <a href="#" className="admin-nav-item">
                <Users size={18} /> Clientes
                </a>
            </nav>
            </aside>

            <main className="perfil-page">
            {tarjetaPerfil}
            </main>
        </div>
        );
    }

    return (
        <>
        <Header />
        <main className="perfil-page">
            {tarjetaPerfil}
        </main>
        <Footer />
        </>
    );
}

export default Perfil;
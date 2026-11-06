import { NavLink } from "react-router-dom";
import { Bell, ClipboardList, Home, ShoppingBag, Users } from "lucide-react";

import { useAdmin } from "../context/AdminContext";

function AdminSidebar() {
    const { noLeidas } = useAdmin();
    const clase = ({ isActive }) => `admin-nav-item${isActive ? " activo" : ""}`;

    return (
        <aside className="admin-sidebar">
            <div className="admin-logo">
                <img src="/img/Marca.png" alt="Jarusa" />
            </div>

            <nav className="admin-nav">
                <NavLink to="/administrador" end className={clase}>
                    <Home size={18} /> Inicio
                </NavLink>
                <NavLink to="/administrador/productos" className={clase}>
                    <ShoppingBag size={18} /> Productos
                </NavLink>
                <NavLink to="/administrador/notificaciones" className={clase}>
                    <Bell size={18} /> Notificaciones
                    {noLeidas > 0 && <span className="admin-nav-badge">{noLeidas}</span>}
                </NavLink>
                <a href="#" className="admin-nav-item">
                    <ClipboardList size={18} /> Pedidos
                </a>
                <a href="#" className="admin-nav-item">
                    <Users size={18} /> Clientes
                </a>
            </nav>
        </aside>
    );
}

export default AdminSidebar;
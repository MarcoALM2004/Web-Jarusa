import { useNavigate } from "react-router-dom";
import { Home, ShoppingBag, ClipboardList, Users, CircleUserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/Administrador.css";

const stats = [
    { icon: ShoppingBag, label: "Pedidos Totales", valor: 24 },
    { icon: Users, label: "Clientes Registrados", valor: 43 },
    { icon: ClipboardList, label: "Productos en Stock", valor: 18 },
    { icon: Home, label: "Ventas al día", valor: "S/ 1500" },
];

    const pedidosRecientes = [
    { id: "#JAR-101", cliente: "Ana Torres", fecha: "22 Sep", estado: "En camino", total: "S/58.00" },
    { id: "#JAR-102", cliente: "Valeria Rojas", fecha: "22 Sep", estado: "Procesando", total: "S/32.00" },
    { id: "#JAR-103", cliente: "Camila López", fecha: "22 Sep", estado: "Entregado", total: "S/15.00" },
    { id: "#JAR-104", cliente: "Daniela Silva", fecha: "22 Sep", estado: "Entregado", total: "S/35.00" },
];

    function Administrador() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    if (!usuario) {
        navigate("/login");
        return null;
    }

    if (usuario.rol !== "ADMIN") {
        navigate("/");
        return null;
    }

    return (
        <div className="admin-layout">

        <aside className="admin-sidebar">
            <div className="admin-logo">
                <img src="/img/Marca.png" />
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

        <main className="admin-content">

            <header className="admin-topbar">
                <div className="admin-bienvenida">
                    <div className="admin-bienvenida-texto">
                    <h1>¡Bienvenido Admin!</h1>
                    <p>Aquí tienes un resumen de la tienda hoy</p>
                    </div>
                    <img src="/img/BannerAdmin.png" alt="" className="admin-bienvenida-img" />
                </div>

                <button className="admin-usuario" onClick={() => navigate("/perfil")}>
                    <CircleUserRound size={22} />
                    <span>{usuario.nombre}</span>
                </button>
            </header>

            <section className="admin-stats">
            {stats.map(({ icon: Icon, label, valor }) => (
                <div className="admin-stat-card" key={label}>
                <div className="admin-stat-icono">
                    <Icon size={20} />
                </div>
                <p className="admin-stat-label">{label}</p>
                <p className="admin-stat-valor">{valor}</p>
                </div>
            ))}
            </section>

            <section className="admin-fila-inferior">
            <div className="admin-tabla-card">
                <h2>Pedidos recientes</h2>
                <table className="admin-tabla">
                <thead>
                    <tr>
                    <th>#Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosRecientes.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.cliente}</td>
                        <td>{p.fecha}</td>
                        <td>
                        <span className={`admin-estado admin-estado-${p.estado.toLowerCase().replace(" ", "-")}`}>
                            {p.estado}
                        </span>
                        </td>
                        <td>{p.total}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="admin-promo-card">
                <img src="/img/Administracion.png" alt="La belleza también se administra" className="admin-promo-img" />
                <p className="admin-promo-texto">¡La belleza también se administra!</p>
                <a href="/productos" className="admin-promo-boton">Gestionar Productos</a>
            </div>
            </section>

        </main>
        </div>
    );
}

export default Administrador;
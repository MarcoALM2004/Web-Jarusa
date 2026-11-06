import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, CircleUserRound, PackageX, ShoppingBag } from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

import "../styles/AdminNotificaciones.css";

const fechaHora = (f) =>
    new Date(f).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

function AdminNotificaciones() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const { notificaciones, noLeidas, conectado, marcarLeidas } = useAdmin();
    const [error, setError] = useState("");

    const alMarcar = async () => {
        try {
            await marcarLeidas();
            setError("");
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <AdminLayout>
            <main className="admin-content">
                <header className="admin-topbar">
                    <div className="admin-bienvenida-texto">
                        <h1>Notificaciones</h1>
                        <p>Pedidos nuevos y alertas de stock en tiempo real</p>
                    </div>
                    <button className="admin-usuario" onClick={() => navigate("/perfil")}>
                        <CircleUserRound size={22} />
                        <span>{usuario.nombre}</span>
                    </button>
                </header>

                <div className="admin-tabla-card">
                    <div className="an-cabecera">
                        <div className="an-estado">
                            <span className={`an-punto ${conectado ? "on" : ""}`} />
                            {conectado ? "En vivo" : "Reconectando..."}
                        </div>
                        <button className="an-marcar" onClick={alMarcar} disabled={noLeidas === 0}>
                            <CheckCheck size={16} /> Marcar todas como leídas
                        </button>
                    </div>

                    {error && <p className="admin-error">{error}</p>}

                    {notificaciones.length === 0 ? (
                        <p className="admin-vacio">
                            <Bell size={22} /> <br />
                            Aún no hay notificaciones. Aparecerán aquí cuando un cliente haga un pedido.
                        </p>
                    ) : (
                        <ul className="an-lista">
                            {notificaciones.map((n) => (
                                <li key={n.id} className={`an-item ${n.leida ? "" : "nueva"}`}>
                                    <span className={`an-icono ${n.tipo === "STOCK_BAJO" ? "alerta" : ""}`}>
                                        {n.tipo === "STOCK_BAJO" ? <PackageX size={18} /> : <ShoppingBag size={18} />}
                                    </span>
                                    <div>
                                        <p>{n.mensaje}</p>
                                        <small>{fechaHora(n.fecha)}</small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </AdminLayout>
    );
}

export default AdminNotificaciones;
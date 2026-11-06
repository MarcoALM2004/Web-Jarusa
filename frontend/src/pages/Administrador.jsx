import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ShoppingBag, ClipboardList, Users, CircleUserRound } from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import { obtenerResumen } from "../services/adminService";
import { useAdminEvento } from "../context/AdminContext";

import "../styles/Administrador.css";

const ESTADOS = {
    PROCESANDO: { texto: "Procesando", clase: "procesando" },
    EN_CAMINO: { texto: "En camino", clase: "en-camino" },
    ENTREGADO: { texto: "Entregado", clase: "entregado" },
};

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;
const fechaCorta = (f) => new Date(f).toLocaleDateString("es-PE", { day: "2-digit", month: "short" });

function Administrador() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [resumen, setResumen] = useState(null);
    const [error, setError] = useState("");

    const cargar = useCallback(() => {
        obtenerResumen()
            .then((r) => {
                setResumen(r);
                setError("");
            })
            .catch((e) => setError(e.message));
    }, []);

    useAdminEvento(cargar);

    useEffect(() => {
        cargar();
    }, [cargar]);

    const stats = [
        { icon: ShoppingBag, label: "Pedidos Totales", valor: resumen?.pedidosTotales ?? "-" },
        { icon: Users, label: "Clientes Registrados", valor: resumen?.clientesRegistrados ?? "-" },
        { icon: ClipboardList, label: "Productos Activos", valor: resumen?.productosActivos ?? "-" },
        { icon: Home, label: "Ventas del día", valor: resumen ? soles(resumen.ventasHoy) : "-" },
    ];

    // Cuando llega un aviso por WebSocket (pedido nuevo) se refrescan las cifras
    return (
        <AdminLayout>
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

                {error && <p className="admin-error">{error}</p>}

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
                        {resumen && resumen.recientes.length === 0 ? (
                            <p className="admin-vacio">Aún no hay pedidos.</p>
                        ) : (
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
                                    {(resumen?.recientes ?? []).map((p) => {
                                        const estado = ESTADOS[p.estado] ?? { texto: p.estado, clase: "procesando" };
                                        return (
                                            <tr key={p.id}>
                                                <td>{p.codigo}</td>
                                                <td>{p.cliente}</td>
                                                <td>{fechaCorta(p.fecha)}</td>
                                                <td>
                                                    <span className={`admin-estado admin-estado-${estado.clase}`}>{estado.texto}</span>
                                                </td>
                                                <td>{soles(p.total)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="admin-promo-card">
                        <img src="/img/Administracion.png" alt="La belleza también se administra" className="admin-promo-img" />
                        <p className="admin-promo-texto">¡La belleza también se administra!</p>
                        <a href="/administrador/productos" className="admin-promo-boton">Gestionar Productos</a>
                    </div>
                </section>
            </main>
        </AdminLayout>
    );
}

export default Administrador;

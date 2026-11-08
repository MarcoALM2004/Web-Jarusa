import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { actualizarPerfil } from "../services/usuarioService";
import { misPedidos } from "../services/pedidoService";

import {
    CircleUserRound,
    ShoppingBag,
    ClipboardList,
    Users,
    UserRound,
    Package,
    CalendarDays,
    ChevronDown,
    ChevronUp
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";

import "../styles/Perfil.css";

const soles = (cantidad) =>
    `S/ ${Number(cantidad || 0).toFixed(2)}`;

const formatoFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";

    // Compatible con LocalDateTime serializado como arreglo
    const fechaReal = Array.isArray(fecha)
        ? new Date(
            fecha[0],
            fecha[1] - 1,
            fecha[2],
            fecha[3] || 0,
            fecha[4] || 0,
            fecha[5] || 0
        )
        : new Date(fecha);

    if (Number.isNaN(fechaReal.getTime())) {
        return "Fecha no disponible";
    }

    return fechaReal.toLocaleString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

function Perfil() {
    const { usuario, login, logout } = useAuth();
    const navigate = useNavigate();

    const [seccion, setSeccion] = useState("datos");
    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // Estados de pedidos
    const [pedidos, setPedidos] = useState([]);
    const [cargandoPedidos, setCargandoPedidos] = useState(false);
    const [errorPedidos, setErrorPedidos] = useState("");
    const [pedidoExpandido, setPedidoExpandido] = useState(null);

    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        email: "",
        celular: "",
        direccion: ""
    });

    // Verificar sesión y cargar información del usuario
    useEffect(() => {
        if (!usuario) {
            navigate("/login", { replace: true });
            return;
        }

        const partes = (usuario.nombre || "").trim().split(/\s+/);

        setFormulario({
            nombre: partes[0] || "",
            apellido: usuario.apellido || partes.slice(1).join(" "),
            email: usuario.email || "",
            celular: usuario.celular || "",
            direccion: usuario.direccion || ""
        });
    }, [usuario, navigate]);

    // Obtener pedidos del cliente
    useEffect(() => {
        if (seccion !== "pedidos" || !usuario) return;

        let activo = true;

        const cargarPedidos = async () => {
            setCargandoPedidos(true);
            setErrorPedidos("");

            try {
                const resultado = await misPedidos();

                if (activo) {
                    setPedidos(Array.isArray(resultado) ? resultado : []);
                }
            } catch (error) {
                if (activo) {
                    setErrorPedidos(
                        error.message || "No se pudieron cargar tus pedidos."
                    );
                }
            } finally {
                if (activo) {
                    setCargandoPedidos(false);
                }
            }
        };

        cargarPedidos();

        return () => {
            activo = false;
        };
    }, [seccion, usuario]);

    if (!usuario) return null;

    // Actualizar campos
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormulario((prev) => ({
            ...prev,
            [name]: value
        }));

        setMensaje("");
    };

    // Guardar información
    const handleGuardar = async (e) => {
        e.preventDefault();
        setMensaje("");

        try {
            const datosActualizados = await actualizarPerfil(
                formulario,
                usuario.token
            );

            login(datosActualizados);

            setEditando(false);
            setMensaje("Tus datos se guardaron correctamente.");

        } catch (error) {
            setMensaje(error.message);
        }
    };

    // Cancelar edición
    const handleCancelar = () => {
        const partes = (usuario.nombre || "").trim().split(/\s+/);

        setFormulario({
            nombre: partes[0] || "",
            apellido: usuario.apellido || partes.slice(1).join(" "),
            email: usuario.email || "",
            celular: usuario.celular || "",
            direccion: usuario.direccion || ""
        });

        setEditando(false);
        setMensaje("");
    };

    // Cerrar sesión
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Iniciales del usuario
    const iniciales = `${formulario.nombre} ${formulario.apellido}`
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0])
        .join("")
        .toUpperCase();

    // Mostrar tarjeta de administrador
    if (usuario.rol === "ADMIN") {
        return (
            <AdminLayout>
                <main className="perfil-page">
                    <div className="perfil-card">
                        <div className="perfil-icono">
                            <CircleUserRound size={64} />
                        </div>

                        <h1>{usuario.nombre}</h1>
                        <p className="perfil-email">{usuario.email}</p>
                        <span className="perfil-rol">{usuario.rol}</span>

                        <button
                            className="perfil-logout"
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </main>
            </AdminLayout>
        );
    }

    return (
        <>
            <Header />

            <main className="perfil-page">
                <div className="perfil-container">

                    <h1 className="perfil-titulo">
                        Mi cuenta
                    </h1>

                    <div className="perfil-contenido">

                        {/* PANEL IZQUIERDO */}
                        <aside className="perfil-sidebar">

                            <div className="perfil-avatar">
                                {iniciales || "U"}
                            </div>

                            <h2>
                                {formulario.nombre} {formulario.apellido}
                            </h2>

                            <p className="perfil-sidebar-email">
                                {formulario.email}
                            </p>

                            <nav className="perfil-menu">

                                <button
                                    type="button"
                                    className={seccion === "datos" ? "activo" : ""}
                                    onClick={() => setSeccion("datos")}
                                >
                                    <UserRound size={17} />
                                    Mis datos
                                </button>

                                <button
                                    type="button"
                                    className={seccion === "pedidos" ? "activo" : ""}
                                    onClick={() => setSeccion("pedidos")}
                                >
                                    <ClipboardList size={17} />
                                    Mis pedidos
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    <Users size={17} />
                                    Cerrar sesión
                                </button>

                            </nav>
                        </aside>

                        {/* PANEL DERECHO */}
                        <section className="perfil-panel">

                            {seccion === "datos" && (
                                <>
                                    <h2>Información personal</h2>

                                    <form onSubmit={handleGuardar}>

                                        <div className="perfil-form-grid">

                                            <div className="perfil-campo">
                                                <label>Nombre</label>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={formulario.nombre}
                                                    onChange={handleChange}
                                                    disabled={!editando}
                                                    required
                                                />
                                            </div>

                                            <div className="perfil-campo">
                                                <label>Apellido</label>
                                                <input
                                                    type="text"
                                                    name="apellido"
                                                    value={formulario.apellido}
                                                    onChange={handleChange}
                                                    disabled={!editando}
                                                />
                                            </div>

                                            <div className="perfil-campo">
                                                <label>Correo electrónico</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formulario.email}
                                                    disabled
                                                />
                                            </div>

                                            <div className="perfil-campo">
                                                <label>Celular</label>
                                                <input
                                                    type="tel"
                                                    name="celular"
                                                    value={formulario.celular}
                                                    onChange={handleChange}
                                                    placeholder="Sin datos"
                                                    disabled={!editando}
                                                />
                                            </div>

                                            <div className="perfil-campo">
                                                <label>Dirección</label>
                                                <input
                                                    type="text"
                                                    name="direccion"
                                                    value={formulario.direccion}
                                                    onChange={handleChange}
                                                    placeholder="Sin datos"
                                                    disabled={!editando}
                                                />
                                            </div>

                                        </div>

                                        <div className="perfil-acciones">

                                            <button
                                                type="submit"
                                                className="perfil-guardar"
                                                disabled={!editando}
                                            >
                                                Guardar datos
                                            </button>

                                            {!editando ? (
                                                <button
                                                    type="button"
                                                    className="perfil-editar"
                                                    onClick={() => {
                                                        setEditando(true);
                                                        setMensaje("");
                                                    }}
                                                >
                                                    Editar datos
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="perfil-cancelar"
                                                    onClick={handleCancelar}
                                                >
                                                    Cancelar
                                                </button>
                                            )}

                                        </div>

                                        {mensaje && (
                                            <p className="perfil-mensaje">
                                                {mensaje}
                                            </p>
                                        )}

                                    </form>
                                </>
                            )}

                            {seccion === "pedidos" && (
                                <div className="perfil-pedidos">

                                    <div className="perfil-pedidos-header">
                                        <h2>Mis pedidos</h2>

                                        {!cargandoPedidos && (
                                            <span className="perfil-total-pedidos">
                                                {pedidos.length} compras
                                            </span>
                                        )}
                                    </div>

                                    {cargandoPedidos && (
                                        <div className="perfil-pedidos-vacio">
                                            <ShoppingBag size={40} />
                                            <p>Cargando tus pedidos...</p>
                                        </div>
                                    )}

                                    {!cargandoPedidos && errorPedidos && (
                                        <div className="perfil-pedidos-vacio">
                                            <ShoppingBag size={40} />
                                            <p>{errorPedidos}</p>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSeccion("datos");
                                                    setTimeout(() => {
                                                        setSeccion("pedidos");
                                                    }, 0);
                                                }}
                                            >
                                                Volver a intentar
                                            </button>
                                        </div>
                                    )}

                                    {!cargandoPedidos &&
                                        !errorPedidos &&
                                        pedidos.length === 0 && (
                                            <div className="perfil-pedidos-vacio">
                                                <ShoppingBag size={40} />

                                                <p>
                                                    Aún no tienes pedidos registrados.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate("/productos")}
                                                >
                                                    Explorar productos
                                                </button>
                                            </div>
                                        )}
                                    {!cargandoPedidos &&
                                        !errorPedidos &&
                                        pedidos.length > 0 && (
                                            <div className="perfil-lista-pedidos">
                                                {pedidos.map((pedido) => (
                                                    <article
                                                        className="perfil-pedido-card"
                                                        key={pedido.id}
                                                    >
                                                        <div className="perfil-pedido-superior">
                                                            <div className="perfil-pedido-icono">
                                                                <Package size={23} />
                                                            </div>
                                                            <div className="perfil-pedido-info">
                                                                <h3>
                                                                    Pedido {pedido.codigo}
                                                                </h3>
                                                                <p>
                                                                    <CalendarDays size={14} />
                                                                    {formatoFecha(pedido.fecha)}
                                                                </p>
                                                            </div>
                                                            <span className={`perfil-pedido-estado ${String(pedido.estado || "").toLowerCase()}`}>
                                                                {pedido.estado}
                                                            </span>
                                                        </div>
                                                        <div className="perfil-pedido-resumen">
                                                            <div>
                                                                <span>Productos</span>
                                                                <strong>
                                                                    {pedido.items?.reduce(
                                                                        (total, item) =>
                                                                            total + item.cantidad,
                                                                        0
                                                                    ) || 0} unidades
                                                                </strong>
                                                            </div>
                                                            <div>
                                                                <span>Total</span>
                                                                <strong className="perfil-pedido-total">
                                                                    {soles(pedido.total)}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="perfil-pedido-detalle-btn"
                                                            onClick={() =>
                                                                setPedidoExpandido(
                                                                    pedidoExpandido === pedido.id
                                                                        ? null
                                                                        : pedido.id
                                                                )
                                                            }
                                                        >
                                                            {pedidoExpandido === pedido.id
                                                                ? "Ocultar detalles"
                                                                : "Ver detalles"}
                                                            {pedidoExpandido === pedido.id
                                                                ? <ChevronUp size={17} />
                                                                : <ChevronDown size={17} />
                                                            }
                                                        </button>
                                                        {pedidoExpandido === pedido.id && (
                                                            <div className="perfil-pedido-detalles">
                                                                <h4>Productos comprados</h4>
                                                                {pedido.items?.map((item, index) => (
                                                                    <div
                                                                        className="perfil-pedido-producto"
                                                                        key={index}
                                                                    >
                                                                        <div>
                                                                            <strong>
                                                                                {item.nombreProducto}
                                                                            </strong>
                                                                            <span>
                                                                                Tono: {item.nombreTono}
                                                                            </span>
                                                                            <span>
                                                                                Cantidad: {item.cantidad}
                                                                            </span>
                                                                        </div>
                                                                        <strong>
                                                                            {soles(
                                                                                item.precioUnitario * item.cantidad
                                                                            )}
                                                                        </strong>
                                                                    </div>
                                                                ))}
                                                                <div className="perfil-pedido-totales">
                                                                    <p>
                                                                        Subtotal
                                                                        <strong>{soles(pedido.subtotal)}</strong>
                                                                    </p>
                                                                    <p>
                                                                        Envío
                                                                        <strong>{soles(pedido.envio)}</strong>
                                                                    </p>
                                                                    <p className="perfil-pedido-total-final">
                                                                        Total
                                                                        <strong>{soles(pedido.total)}</strong>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </article>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Perfil;
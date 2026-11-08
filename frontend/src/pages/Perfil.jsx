
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { actualizarPerfil } from "../services/usuarioService";

import {
    CircleUserRound,
    ShoppingBag,
    ClipboardList,
    Users,
    UserRound
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";

import "../styles/Perfil.css";

function Perfil() {
    const { usuario, login, logout } = useAuth();
    const navigate = useNavigate();

    const [seccion, setSeccion] = useState("datos");
    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        email: "",
        celular: "",
        direccion: ""
    });

    // Cargar información del usuario
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

            // Actualizar contexto y localStorage
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

    // Tarjeta de perfil del administrador
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

    // Perfil del cliente
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
                                    className={
                                        seccion === "datos" ? "activo" : ""
                                    }
                                    onClick={() => setSeccion("datos")}
                                >
                                    <UserRound size={17} />
                                    Mis datos
                                </button>

                                <button
                                    type="button"
                                    className={
                                        seccion === "pedidos" ? "activo" : ""
                                    }
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
                                    <h2>
                                        Información personal
                                    </h2>

                                    <form onSubmit={handleGuardar}>

                                        <div className="perfil-form-grid">

                                            {/* Nombre */}
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

                                            {/* Apellido */}
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

                                            {/* Correo */}
                                            <div className="perfil-campo">
                                                <label>Correo electrónico</label>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formulario.email}
                                                    disabled
                                                />
                                            </div>

                                            {/* Celular */}
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

                                            {/* Dirección */}
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

                                        {/* BOTONES */}
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

                            {/* MIS PEDIDOS */}
                            {seccion === "pedidos" && (
                                <div className="perfil-pedidos">

                                    <h2>Mis pedidos</h2>

                                    <div className="perfil-pedidos-vacio">

                                        <ShoppingBag size={40} />

                                        <p>
                                            Aún no tienes pedidos registrados.
                                        </p>

                                    </div>

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

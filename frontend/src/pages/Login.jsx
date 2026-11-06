import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { login as loginRequest } from "../services/authService";

import "../styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const origen = location.state?.from;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
        const datosUsuario = await loginRequest(email, contrasena);
        login(datosUsuario);

        if (datosUsuario.rol === "ADMIN") {
            navigate("/administrador");
        } else {
            navigate(origen ?? "/");
        }
        } catch (err) {
        setError(err.message);
        } finally {
        setCargando(false);
        }
    };

    return (
        <>
        <Header />

        <main className="login-page">
            <div className="login-card">

            <img src="/img/InicioSesion.png" alt="Inicia sesión" className="login-imagen" />

            <div className="login-form-container">
                <h1>Inicia Sesión</h1>
                <p className="login-subtitle">
                Ingresa tu cuenta o registrate para todo lo que Jarusa tiene para ti
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                <label>Correo Electrónico:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Contraseña:</label>
                <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />

                {error && <p className="login-error">{error}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? "Ingresando..." : "Iniciar Sesión"}
                </button>
                </form>

                <p className="login-registro-link">
                ¿Todavía no tienes cuenta? <a href="/registro">Regístrate</a>
                </p>
            </div>

            </div>
        </main>

        </>
    );
}

export default Login;
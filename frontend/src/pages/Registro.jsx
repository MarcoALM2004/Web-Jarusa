import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { registro as registroRequest } from "../services/authService";

import "../styles/Login.css";

function Registro() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
        const datosUsuario = await registroRequest(nombre, email, contrasena);
        login(datosUsuario);
        navigate("/");
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

            <img src="/img/Registro.png" alt="Regístrate" className="login-imagen" />

            <div className="login-form-container">
                <h1>Regístrate</h1>
                <p className="login-subtitle">
                Crea tu cuenta y únete a Jarusa para descubrir todo lo que tenemos para ti.
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                <label>Nombre:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />

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
                    minLength={6}
                    required
                />

                {error && <p className="login-error">{error}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? "Creando cuenta..." : "Regístrate"}
                </button>
                </form>

                <p className="login-registro-link">
                ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
                </p>
            </div>
            </div>
        </main>

        </>
    );
}

export default Registro;
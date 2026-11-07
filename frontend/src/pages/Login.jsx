import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { login as loginRequest, verificar2fa } from "../services/authService";

import "../styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [tokenTemporal, setTokenTemporal] = useState(null);
    const [codigo, setCodigo] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const origen = location.state?.from;

    const entrar = (datosUsuario) => {
        login(datosUsuario);

        if (datosUsuario.rol === "ADMIN") {
            navigate("/administrador");
        } else {
            navigate(origen ?? "/");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
            const datos = await loginRequest(email, contrasena);
            if (datos.requiere2fa) {
                setTokenTemporal(datos.tokenTemporal);
                setCodigo("");
                return;
            }
            entrar(datos);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const handleVerificar = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);
        try {
            const datos = await verificar2fa(tokenTemporal, codigo);
            entrar(datos);
        } catch (err) {
            setError(err.message);
            setCodigo("");
            if (err.status === 401 && err.message.startsWith("El pase temporal")) {
                volverAlLogin(err.message);
            }
        } finally {
            setCargando(false);
        }
    };

    const volverAlLogin = (mensaje = "") => {
        setTokenTemporal(null);
        setCodigo("");
        setContrasena("");
        setError(mensaje);
    };

    return (
        <>
        <Header />

        <main className="login-page">
            <div className="login-card">

            <img src="/img/InicioSesion.png" alt="Inicia sesión" className="login-imagen" />

            <div className="login-form-container">
                {tokenTemporal ? (
                <>
                    <h1>Verificación</h1>
                    <p className="login-subtitle">
                    Ingresa el código de 6 dígitos de tu app autenticadora
                    </p>

                    <form onSubmit={handleVerificar} className="login-form">
                    <label>Código de verificación:</label>
                    <input
                        className="login-codigo"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="000000"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
                        autoFocus
                        required
                    />
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" disabled={cargando || codigo.length !== 6}>
                        {cargando ? "Verificando..." : "Verificar"}
                    </button>
                    </form>
                    <button type="button" className="login-enlace" onClick={() => volverAlLogin()}>
                    ← Volver al inicio de sesión
                    </button>
                </>
                ) : (
                <>
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
                </>
                )}
            </div>
            </div>
        </main>
        </>
    );
}

export default Login;
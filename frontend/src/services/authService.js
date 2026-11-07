import { API_URL as API } from "../config";

const API_URL = `${API}/auth`;

export async function login(email, contrasena) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.mensaje || "No se pudo iniciar sesión");
    }
    return data;
}

export async function verificar2fa(tokenTemporal, codigo) {
    const res = await fetch(`${API_URL}/2fa/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenTemporal, codigo }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const error = new Error(data.mensaje || "No se pudo verificar el código");
        error.status = res.status;
        throw error;
    }

    return data;
}

export async function registro(nombre, email, contrasena) {
    const res = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, contrasena }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.mensaje || "No se pudo completar el registro");
    }

    return data;
}
import { API_URL } from "../config";

function leerToken() {
    try {
        return JSON.parse(localStorage.getItem("usuario"))?.token ?? null;
    } catch {
        return null;
    }
}

// Cliente unico para hablar con el backend: agrega el token, lee { mensaje } y maneja 401
export async function api(path, { method = "GET", body, formData, signal } = {}) {
    const headers = {};
    const token = leerToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
        signal,
    });

    if (res.status === 204) return null;

    let data = null;
    try {
        data = await res.json();
    } catch {
        // respuesta sin JSON
    }

    if (!res.ok) {
        if (res.status === 401 && token) {
            localStorage.removeItem("usuario");
            window.dispatchEvent(new Event("sesion-expirada"));
        }
        throw new Error(data?.mensaje || `Error ${res.status}`);
    }
    return data;
}

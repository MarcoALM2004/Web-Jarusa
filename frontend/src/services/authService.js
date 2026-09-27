const API_URL = "http://localhost:8081/api/auth";

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
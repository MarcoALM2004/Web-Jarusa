
const API_URL = "http://localhost:8081/api/usuarios";

export async function actualizarPerfil(datos, token) {

    const response = await fetch(`${API_URL}/perfil`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    const resultado = await response.json();

    if (!response.ok) {
        throw new Error(
            resultado.mensaje || "No se pudo actualizar el perfil"
        );
    }

    return resultado;
}

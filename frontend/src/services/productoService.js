const API_URL = "http://localhost:8081/api";

export async function obtenerProductos({ nombre = "", categorias = [] } = {}, signal) {
    const params = new URLSearchParams();
    if (nombre.trim()) params.set("nombre", nombre.trim());
    if (categorias.length > 0) params.set("categorias", categorias.join(","));

    const query = params.toString();
    const res = await fetch(`${API_URL}/productos${query ? `?${query}` : ""}`, { signal });

    if (!res.ok) {
        throw new Error("No se pudieron cargar los productos");
    }
    return res.json();
}

export async function obtenerCategorias() {
    const res = await fetch(`${API_URL}/categorias`);

    if (!res.ok) {
        throw new Error("No se pudieron cargar las categorías");
    }
    return res.json();
}

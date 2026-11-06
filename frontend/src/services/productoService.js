import { api } from "./apiClient";

export function obtenerProductos({ nombre = "", categorias = [] } = {}, signal) {
    const params = new URLSearchParams();
    if (nombre.trim()) params.set("nombre", nombre.trim());
    if (categorias.length > 0) params.set("categorias", categorias.join(","));

    const query = params.toString();
    return api(`/productos${query ? `?${query}` : ""}`, { signal });
}

export function obtenerProducto(id, signal) {
    return api(`/productos/${id}`, { signal });
}

export function obtenerCategorias() {
    return api("/categorias");
}

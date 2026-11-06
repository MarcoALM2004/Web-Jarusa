import { api } from "./apiClient";

export const obtenerResumen = () => api("/admin/resumen");
export const listarProductosAdmin = () => api("/admin/productos");
export const crearProducto = (datos) => api("/admin/productos", { method: "POST", body: datos });
export const actualizarProducto = (id, datos) => api(`/admin/productos/${id}`, { method: "PUT", body: datos });
export const eliminarProducto = (id) => api(`/admin/productos/${id}`, { method: "DELETE" });

export function subirImagen(archivo) {
    const formData = new FormData();
    formData.append("archivo", archivo);
    return api("/admin/imagenes", { method: "POST", formData });
}

export const listarNotificaciones = () => api("/admin/notificaciones");
export const marcarNotificacionesLeidas = () => api("/admin/notificaciones/leidas", { method: "PUT" });
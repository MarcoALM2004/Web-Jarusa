import { api } from "./apiClient";

export const crearPedido = (items) => api("/pedidos", { method: "POST", body: { items } });
export const misPedidos = () => api("/pedidos/mis-pedidos");

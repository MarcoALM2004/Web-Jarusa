// URL del backend. En produccion se define con VITE_API_URL (ver .env.example)
export const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8081").replace(/\/$/, "");
export const API_URL = `${API_BASE}/api`;
export const WS_URL = `${API_BASE.replace(/^http/, "ws")}/ws/admin`;

// Debe coincidir con app.envio del backend (application.properties)
export const ENVIO = 5;
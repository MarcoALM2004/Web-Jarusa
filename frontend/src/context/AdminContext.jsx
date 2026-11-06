import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "./AuthContext";
import { useAdminSocket } from "../hooks/useAdminSocket";
import { listarNotificaciones, marcarNotificacionesLeidas } from "../services/adminService";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const { usuario } = useAuth();
    const esAdmin = usuario?.rol === "ADMIN";

    const [notificaciones, setNotificaciones] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const suscriptores = useRef(new Set());

    // Historial guardado en la BD: aunque no estuvieras conectado, al entrar lo ves
    useEffect(() => {
        if (!esAdmin) {
            setNotificaciones([]);
            return;
        }
        listarNotificaciones()
            .then((d) => setNotificaciones(d.items))
            .catch(() => {});
    }, [esAdmin]);

    const conectado = useAdminSocket((msg) => {
        if (msg.tipo !== "NOTIFICACION") return;
        const n = msg.notificacion;

        setNotificaciones((prev) => (prev.some((x) => x.id === n.id) ? prev : [n, ...prev].slice(0, 50)));

        const id = `${n.id}-${Date.now()}`;
        setAvisos((prev) => [...prev, { id, tipo: n.tipo, texto: n.mensaje }]);
        setTimeout(() => setAvisos((prev) => prev.filter((a) => a.id !== id)), 7000);

        suscriptores.current.forEach((fn) => fn(n));
    }, esAdmin);

    const noLeidas = useMemo(() => notificaciones.filter((n) => !n.leida).length, [notificaciones]);

    const marcarLeidas = useCallback(async () => {
        await marcarNotificacionesLeidas();
        setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    }, []);

    const suscribir = useCallback((fn) => {
        suscriptores.current.add(fn);
        return () => suscriptores.current.delete(fn);
    }, []);

    const valor = useMemo(
        () => ({ notificaciones, noLeidas, avisos, conectado, marcarLeidas, suscribir }),
        [notificaciones, noLeidas, avisos, conectado, marcarLeidas, suscribir]
    );

    return <AdminContext.Provider value={valor}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin debe usarse dentro de <AdminProvider>");
    return context;
}

// Para que una pagina refresque sus datos cuando llega una notificacion
export function useAdminEvento(fn) {
    const { suscribir } = useAdmin();
    const ref = useRef(fn);

    useEffect(() => {
        ref.current = fn;
    });

    useEffect(() => suscribir((n) => ref.current?.(n)), [suscribir]);
}
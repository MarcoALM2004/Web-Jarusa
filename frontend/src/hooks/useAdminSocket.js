import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { WS_URL } from "../config";

export function useAdminSocket(alMensaje, activo = true) {
    const { usuario } = useAuth();
    const callback = useRef(alMensaje);
    const [conectado, setConectado] = useState(false);

    useEffect(() => {
        callback.current = alMensaje;
    });

    const token = usuario?.token;

    useEffect(() => {
        if (!token || !activo) return undefined;

        let ws;
        let temporizador;
        let cerrado = false;

        const conectar = () => {
            ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
            ws.onopen = () => setConectado(true);
            ws.onmessage = (e) => {
                try {
                    callback.current?.(JSON.parse(e.data));
                } catch {
                    // mensaje que no es JSON
                }
            };
            ws.onclose = () => {
                setConectado(false);
                if (!cerrado) temporizador = setTimeout(conectar, 3000);
            };
        };

        conectar();

        return () => {
            cerrado = true;
            clearTimeout(temporizador);
            ws?.close();
        };
    }, [token, activo]);

    return conectado;
}
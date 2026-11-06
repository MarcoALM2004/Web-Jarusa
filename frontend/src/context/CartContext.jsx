import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const MAX_POR_PRODUCTO = 20; // igual que el backend

function leerGuardado() {
    try {
        const g = JSON.parse(localStorage.getItem("carrito"));
        return Array.isArray(g) ? g : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(leerGuardado);

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(items));
    }, [items]);

    // item: { productoId, tonoId, nombre, tono, colorHex, precio, imagenUrl, stock }
    const agregar = (item, cantidad = 1) => {
        setItems((prev) => {
            const tope = Math.min(item.stock, MAX_POR_PRODUCTO);
            const existe = prev.find((i) => i.tonoId === item.tonoId);
            if (existe) {
                return prev.map((i) =>
                    i.tonoId === item.tonoId
                        ? { ...i, stock: item.stock, cantidad: Math.min(i.cantidad + cantidad, tope) }
                        : i
                );
            }
            return [...prev, { ...item, cantidad: Math.min(cantidad, tope) }];
        });
    };

    const cambiarCantidad = (tonoId, cantidad) =>
        setItems((prev) =>
            prev.map((i) =>
                i.tonoId === tonoId
                    ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock, MAX_POR_PRODUCTO)) }
                    : i
            )
        );

    const quitar = (tonoId) => setItems((prev) => prev.filter((i) => i.tonoId !== tonoId));
    const vaciar = () => setItems([]);

    const valor = useMemo(
        () => ({
            items,
            agregar,
            cambiarCantidad,
            quitar,
            vaciar,
            cantidadTotal: items.reduce((s, i) => s + i.cantidad, 0),
            subtotal: items.reduce((s, i) => s + i.precio * i.cantidad, 0),
        }),
        [items]
    );

    return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de <CartProvider>");
    }
    return context;
}
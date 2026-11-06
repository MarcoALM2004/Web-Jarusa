import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ENVIO } from "../config";
import { crearPedido } from "../services/pedidoService";

import "../styles/Carrito.css";

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

function Carrito() {
    const { items, cambiarCantidad, quitar, vaciar, subtotal } = useCart();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");
    const [pedido, setPedido] = useState(null);

    const envio = items.length > 0 ? ENVIO : 0;
    const total = subtotal + envio;

    const comprar = async () => {
        if (!usuario) {
            navigate("/login", { state: { from: "/carrito" } });
            return;
        }
        setError("");
        setEnviando(true);
        try {
            const creado = await crearPedido(
                items.map((i) => ({ productoId: i.productoId, tonoId: i.tonoId, cantidad: i.cantidad }))
            );
            vaciar();
            setPedido(creado);
        } catch (e) {
            setError(e.message);
        } finally {
            setEnviando(false);
        }
    };

    if (pedido) {
        return (
            <>
                <Header />
                <main className="carrito-page">
                    <section className="carrito-confirmacion">
                        <h1>¡Gracias por tu compra!</h1>
                        <p>
                            Tu pedido <strong>{pedido.codigo}</strong> fue registrado por un total de{" "}
                            <strong>{soles(pedido.total)}</strong>.
                        </p>
                        <Link to="/productos" className="carrito-btn">
                            Seguir comprando
                        </Link>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="carrito-page">
                <h1 className="carrito-titulo">Carrito de Compras</h1>
                <p className="carrito-sub">¡Con tanto maquillaje lleno de belleza y amor propio!</p>

                {items.length === 0 ? (
                    <section className="carrito-vacio">
                        <p>Tu carrito está vacío.</p>
                        <Link to="/productos" className="carrito-btn">
                            Ver productos
                        </Link>
                    </section>
                ) : (
                    <div className="carrito-layout">
                        <section className="carrito-lista">
                            {items.map((i) => (
                                <article className="carrito-item" key={i.tonoId}>
                                    <img src={i.imagenUrl} alt={i.nombre} />
                                    <div className="carrito-item-info">
                                        <h3>{i.nombre}</h3>
                                        <p>{i.tono}</p>
                                        <p className="carrito-item-precio">{soles(i.precio)}</p>
                                    </div>
                                    <div className="carrito-cantidad">
                                        <button type="button" onClick={() => cambiarCantidad(i.tonoId, i.cantidad - 1)} disabled={i.cantidad <= 1} aria-label="Menos">
                                            <Minus size={14} />
                                        </button>
                                        <span>{i.cantidad}</span>
                                        <button type="button" onClick={() => cambiarCantidad(i.tonoId, i.cantidad + 1)} disabled={i.cantidad >= Math.min(i.stock, 20)} aria-label="Más">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <p className="carrito-item-total">{soles(i.precio * i.cantidad)}</p>
                                    <button type="button" className="carrito-quitar" onClick={() => quitar(i.tonoId)} aria-label={`Quitar ${i.nombre}`}>
                                        <Trash2 size={18} />
                                    </button>
                                </article>
                            ))}
                        </section>

                        <aside className="carrito-resumen">
                            <h2>Resumen de Pedido</h2>
                            <dl>
                                <div><dt>Subtotal</dt><dd>{soles(subtotal)}</dd></div>
                                <div><dt>Envío</dt><dd>{soles(envio)}</dd></div>
                                <div className="total"><dt>Total</dt><dd>{soles(total)}</dd></div>
                            </dl>
                            {error && <p className="carrito-error">{error}</p>}
                            <button type="button" className="carrito-btn" onClick={comprar} disabled={enviando}>
                                {enviando ? "Registrando..." : usuario ? "Registrar Compra" : "Inicia sesión para comprar"}
                            </button>
                            <Link to="/productos" className="carrito-btn secundario">
                                Seguir comprando
                            </Link>
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default Carrito;

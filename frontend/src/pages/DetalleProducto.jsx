import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { obtenerProducto } from "../services/productoService";

import "../styles/DetalleProducto.css";

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

function DetalleProducto() {
    const { id } = useParams();
    const { agregar } = useCart();

    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [tonoId, setTonoId] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [agregado, setAgregado] = useState(false);
    const [imagenActiva, setImagenActiva] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setCargando(true);
        setError("");
        setAgregado(false);

        obtenerProducto(id, controller.signal)
            .then((p) => {
                setProducto(p);
                setTonoId((p.tonos.find((t) => t.stock > 0) ?? p.tonos[0])?.id ?? null);
                setCantidad(1);
                setImagenActiva(0);
                setCargando(false);
            })
            .catch((e) => {
                if (e.name === "AbortError") return;
                setError(e.message);
                setCargando(false);
            });

        return () => controller.abort();
    }, [id]);

    const tono = producto?.tonos.find((t) => t.id === tonoId);
    const maxCantidad = tono ? Math.min(tono.stock, 20) : 0;
    const galeria = producto ? [producto.imagenUrl, ...(producto.imagenes ?? [])] : [];
    const caracteristicas = (producto?.caracteristicas ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const elegirTono = (t) => {
        setTonoId(t.id);
        setCantidad(1);
        setAgregado(false);
    };

    const alAgregar = () => {
        agregar(
            {
                productoId: producto.id,
                tonoId: tono.id,
                nombre: producto.nombre,
                tono: tono.nombre,
                colorHex: tono.colorHex,
                precio: Number(producto.precio),
                imagenUrl: producto.imagenUrl,
                stock: tono.stock,
            },
            cantidad
        );
        setAgregado(true);
    };

    return (
        <>
            <Header />
            <main className="detalle-page">
                {cargando && <p className="detalle-mensaje">Cargando...</p>}
                {error && (
                    <p className="detalle-mensaje">
                        {error} <Link to="/productos">Volver a productos</Link>
                    </p>
                )}

                {producto && (
                    <section className="detalle-grid">
                        <div className="detalle-galeria">
                            <div className="detalle-foto">
                                <img src={galeria[imagenActiva] ?? producto.imagenUrl} alt={producto.nombre} />
                            </div>

                            {galeria.length > 1 && (
                                <div className="detalle-minis">
                                    {galeria.map((src, i) => (
                                        <button
                                            key={`${src}-${i}`}
                                            type="button"
                                            className={`mini ${i === imagenActiva ? "activa" : ""}`}
                                            onClick={() => setImagenActiva(i)}
                                            aria-label={`Ver imagen ${i + 1}`}
                                        >
                                            <img src={src} alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="detalle-info">
                            <div className="detalle-titulo">
                                <h1>{producto.nombre}</h1>
                                <Link to={`/productos?categoria=${producto.categoriaId}`} className="detalle-categoria">
                                    {producto.categoria}
                                </Link>
                            </div>
                            <p className="detalle-precio">{soles(producto.precio)}</p>

                            <h2>Tonos:</h2>
                            <div className="detalle-tonos">
                                {producto.tonos.map((t, i) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        title={`${t.nombre}${t.stock === 0 ? " (agotado)" : ""}`}
                                        className={`tono ${t.id === tonoId ? "activo" : ""} ${t.stock === 0 ? "agotado" : ""} ${t.colorHex ? "" : "sin-color"}`}
                                        style={t.colorHex ? { backgroundColor: t.colorHex } : undefined}
                                        onClick={() => elegirTono(t)}
                                    >
                                        {t.colorHex ? "" : i + 1}
                                    </button>
                                ))}
                            </div>
                            {tono && (tono.stock === 0 || tono.stock <= 5) && (
                                <p className="detalle-stock">{tono.stock === 0 ? "Tono agotado" : `Quedan ${tono.stock}`}</p>
                            )}

                            <div className="detalle-acciones">
                                <div className="detalle-cantidad">
                                    <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} aria-label="Menos">
                                        -
                                    </button>
                                    <span>{cantidad}</span>
                                    <button type="button" onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))} disabled={cantidad >= maxCantidad} aria-label="Más">
                                        +
                                    </button>
                                </div>
                                <button type="button" className="detalle-agregar" onClick={alAgregar} disabled={!tono || tono.stock === 0}>
                                    Agregar al Carrito
                                </button>
                            </div>
                            {agregado && (
                                <p className="detalle-ok">
                                    Agregado al carrito. <Link to="/carrito">Ver carrito</Link>
                                </p>
                            )}

                            {producto.descripcion && (
                                <>
                                    <h2>Descripción:</h2>
                                    <p className="detalle-texto">{producto.descripcion}</p>
                                </>
                            )}

                            {caracteristicas.length > 0 && (
                                <>
                                    <h2>Características:</h2>
                                    <ul className="detalle-lista">
                                        {caracteristicas.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}

export default DetalleProducto;
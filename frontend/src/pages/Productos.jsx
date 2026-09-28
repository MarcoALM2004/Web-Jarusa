import { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { obtenerProductos, obtenerCategorias } from "../services/productoService";

import "../styles/Productos.css";

const formatearPrecio = (precio) => {
    const n = Number(precio);
    return `S/ ${Number.isInteger(n) ? n : n.toFixed(2)}`;
    };

function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [busqueda, setBusqueda] = useState("");

    const [seleccion, setSeleccion] = useState([]);
    const [filtrosAplicados, setFiltrosAplicados] = useState([]);

    useEffect(() => {
        obtenerCategorias()
        .then(setCategorias)
        .catch(() => setError("No se pudieron cargar las categorías"));
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const timer = setTimeout(() => {
        setCargando(true);
        obtenerProductos({ nombre: busqueda, categorias: filtrosAplicados }, controller.signal)
            .then((data) => {
            setProductos(data);
            setError("");
            setCargando(false);
            })
            .catch((err) => {
            if (err.name === "AbortError") return;
            setError(err.message);
            setCargando(false);
            });
        }, 300);

        return () => {
        clearTimeout(timer);
        controller.abort();
        };
    }, [busqueda, filtrosAplicados]);

    const alternarCategoria = (id) => {
        setSeleccion((prev) =>
        prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const aplicarFiltros = () => setFiltrosAplicados(seleccion);

    const limpiarFiltros = () => {
        setSeleccion([]);
        setFiltrosAplicados([]);
        setBusqueda("");
    };

    const hayFiltros = filtrosAplicados.length > 0 || busqueda.trim() !== "";
    return (
        <>
        <Header mostrarBuscador busqueda={busqueda} onBusqueda={setBusqueda} />
        <main className="productos-page">
            <section className="productos-hero">
            <img src="/img/Productos.png" alt="" className="productos-hero-img" />
            <div className="productos-hero-texto">
                <h1>Productos</h1>
                <p>Tu maquillaje favorito, en un solo lugar</p>
            </div>
            </section>
            <div className="productos-layout">
            <aside className="filtros">
                <h2>Filtrar por:</h2>
                <ul>
                {categorias.map((cat) => (
                    <li key={cat.id}>
                    <label>
                        <input
                        type="checkbox"
                        checked={seleccion.includes(cat.id)}
                        onChange={() => alternarCategoria(cat.id)}
                        />
                        <span>{cat.nombre}</span>
                    </label>
                    </li>
                ))}
                </ul>
                <button className="btn-filtros" onClick={aplicarFiltros}>
                Aplicar Filtros
                </button>
                {hayFiltros && (
                <button className="btn-limpiar" onClick={limpiarFiltros}>
                    Limpiar
                </button>
                )}
            </aside>
            <section className="productos-grid-wrap">
                {error && <p className="productos-mensaje">{error}</p>}
                {!error && !cargando && productos.length === 0 && (
                <p className="productos-mensaje">
                    No encontramos productos con esa búsqueda 
                </p>
                )}
                <div className="productos-grid">
                {productos.map((p) => (
                    <article className="producto-item" key={p.id}>
                    <img src={p.imagenUrl} alt={p.nombre} />
                    <h3>{p.nombre}</h3>
                    <span className="producto-precio">{formatearPrecio(p.precio)}</span>
                    <button className="btn-detalles">Detalles +</button>
                    </article>
                ))}
                </div>
            </section>
            </div>
        </main>
        <Footer />
        </>
    );
}

export default Productos;

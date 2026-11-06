import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { obtenerCategorias } from "../services/productoService";

import "../styles/Categorias.css";

// "Rímel" -> "Rimel": las imagenes de /public/img no llevan tilde
const sinTildes = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerCategorias()
            .then((data) => setCategorias([...data].sort((a, b) => a.id - b.id))) // orden del Figma
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    return (
        <>
            <Header />
            <main className="categorias-page">
                <h1>Categorías</h1>
                <p className="categorias-sub">
                    Descubre tu categoría favorita
                    <br />
                    Todo para crear tu look ideal
                </p>

                {error && <p className="categorias-mensaje">{error}</p>}
                {cargando && !error && <p className="categorias-mensaje">Cargando...</p>}

                <div className="categorias-grid">
                    {categorias.map((c) => (
                        <article className="categoria-card" key={c.id}>
                            <img
                                src={`/img/${sinTildes(c.nombre)}.png`}
                                alt={c.nombre}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/img/Logo.png";
                                }}
                            />
                            <Link to={`/productos?categoria=${c.id}`} className="categoria-ver" aria-label={`Ver ${c.nombre}`}>
                                Ver →
                            </Link>
                        </article>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Categorias;
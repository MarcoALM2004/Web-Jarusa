import { useCallback, useEffect, useState } from "react";
import { CircleUserRound, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import { obtenerCategorias } from "../services/productoService";
import {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    listarProductosAdmin,
    subirImagen,
} from "../services/adminService";

import { useAdminEvento } from "../context/AdminContext";

import "../styles/AdminProductos.css";

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;
const stockTotal = (p) => p.tonos.reduce((s, t) => s + t.stock, 0);

const TONO_VACIO = { id: null, nombre: "", colorHex: "", stock: "" };
const FORM_VACIO = {
    nombre: "",
    precio: "",
    descripcion: "",
    caracteristicas: "",
    imagenUrl: "",
    categoriaId: "",
    tonos: [TONO_VACIO],
};

const aFormulario = (p) => ({
    nombre: p.nombre,
    precio: String(p.precio),
    descripcion: p.descripcion ?? "",
    caracteristicas: p.caracteristicas ?? "",
    imagenUrl: p.imagenUrl,
    categoriaId: String(p.categoriaId),
    tonos: p.tonos.map((t) => ({ id: t.id, nombre: t.nombre, colorHex: t.colorHex ?? "", stock: String(t.stock) })),
});

function ProductoForm({ inicial, categorias, guardando, error, onGuardar, onCancelar }) {
    const [form, setForm] = useState(inicial);
    const [subiendo, setSubiendo] = useState(false);
    const [errorImagen, setErrorImagen] = useState("");

    const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

    const cambiarTono = (i, campo, valor) =>
        setForm((f) => ({ ...f, tonos: f.tonos.map((t, j) => (j === i ? { ...t, [campo]: valor } : t)) }));
    const agregarTono = () => setForm((f) => ({ ...f, tonos: [...f.tonos, { ...TONO_VACIO }] }));
    const quitarTono = (i) => setForm((f) => ({ ...f, tonos: f.tonos.filter((_, j) => j !== i) }));

    const elegirArchivo = async (e) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;
        setErrorImagen("");
        setSubiendo(true);
        try {
            const { url } = await subirImagen(archivo);
            setForm((f) => ({ ...f, imagenUrl: url }));
        } catch (err) {
            setErrorImagen(err.message);
        } finally {
            setSubiendo(false);
            e.target.value = "";
        }
    };

    const enviar = (e) => {
        e.preventDefault();
        onGuardar({
            nombre: form.nombre.trim(),
            precio: Number(form.precio),
            descripcion: form.descripcion.trim() || null,
            caracteristicas: form.caracteristicas.trim() || null,
            imagenUrl: form.imagenUrl.trim(),
            categoriaId: Number(form.categoriaId),
            tonos: form.tonos.map((t) => ({
                id: t.id,
                nombre: t.nombre.trim(),
                colorHex: t.colorHex.trim() || null,
                stock: Number(t.stock),
            })),
        });
    };

    return (
        <form className="ap-form" onSubmit={enviar}>
            <label>
                Nombre
                <input value={form.nombre} onChange={cambiar("nombre")} maxLength={100} required />
            </label>

            <div className="ap-fila">
                <label>
                    Precio (S/)
                    <input type="number" step="0.01" min="0.01" max="9999.99" value={form.precio} onChange={cambiar("precio")} required />
                </label>
                <label>
                    Categoría
                    <select value={form.categoriaId} onChange={cambiar("categoriaId")} required>
                        <option value="">Selecciona...</option>
                        {categorias.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </label>
            </div>

            <label>
                Descripción
                <input value={form.descripcion} onChange={cambiar("descripcion")} maxLength={255} />
            </label>

            <label>
                Características (una por línea)
                <textarea rows={3} value={form.caracteristicas} onChange={cambiar("caracteristicas")} maxLength={1000} />
            </label>

            <div className="ap-imagen">
                <span>Imagen</span>
                <div className="ap-imagen-fila">
                    {form.imagenUrl ? (
                        <img src={form.imagenUrl} alt="Vista previa" />
                    ) : (
                        <div className="ap-imagen-vacia">Sin imagen</div>
                    )}
                    <div className="ap-imagen-campos">
                        <label className="ap-subir">
                            <Upload size={16} /> {subiendo ? "Subiendo..." : "Subir imagen"}
                            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={elegirArchivo} disabled={subiendo} hidden />
                        </label>
                        <input
                            placeholder="o escribe la ruta: /img/Producto1.png"
                            value={form.imagenUrl}
                            onChange={cambiar("imagenUrl")}
                            maxLength={255}
                            required
                        />
                        {errorImagen && <small className="ap-error">{errorImagen}</small>}
                    </div>
                </div>
            </div>

            <fieldset className="ap-tonos">
                <legend>Tonos</legend>
                {form.tonos.map((t, i) => (
                    <div className="ap-tono" key={t.id ?? `nuevo-${i}`}>
                        <input placeholder="Nombre (Tono 1)" value={t.nombre} onChange={(e) => cambiarTono(i, "nombre", e.target.value)} maxLength={50} required />
                        <span className="ap-muestra" style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(t.colorHex) ? t.colorHex : "transparent" }} />
                        <input placeholder="#FF69B4" value={t.colorHex} onChange={(e) => cambiarTono(i, "colorHex", e.target.value)} pattern="#[0-9A-Fa-f]{6}" title="Formato #RRGGBB (opcional)" />
                        <input type="number" min="0" placeholder="Stock" value={t.stock} onChange={(e) => cambiarTono(i, "stock", e.target.value)} required />
                        <button type="button" className="ap-icono" onClick={() => quitarTono(i)} disabled={form.tonos.length === 1} aria-label="Quitar tono">
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <button type="button" className="ap-link" onClick={agregarTono}>
                    <Plus size={14} /> Agregar tono
                </button>
            </fieldset>

            {error && <p className="ap-error">{error}</p>}

            <div className="ap-botones">
                <button type="button" className="ap-btn secundario" onClick={onCancelar}>Cancelar</button>
                <button type="submit" className="ap-btn" disabled={guardando || subiendo}>
                    {guardando ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </form>
    );
}

function AdminProductos() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const [formulario, setFormulario] = useState(null); // { producto | null }
    const [guardando, setGuardando] = useState(false);
    const [errorForm, setErrorForm] = useState("");
    const [porEliminar, setPorEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const cargar = useCallback(() => {
        listarProductosAdmin()
            .then((data) => {
                setProductos(data);
                setError("");
            })
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);
    useAdminEvento(cargar);

    useEffect(() => {
        cargar();
        obtenerCategorias().then(setCategorias).catch((e) => setError(e.message));
    }, [cargar]);

    const avisar = (texto) => {
        setMensaje(texto);
        setTimeout(() => setMensaje(""), 4000);
    };

    const abrirNuevo = () => {
        setErrorForm("");
        setFormulario({ producto: null });
    };
    const abrirEdicion = (p) => {
        setErrorForm("");
        setFormulario({ producto: p });
    };

    const guardar = async (datos) => {
        setGuardando(true);
        setErrorForm("");
        try {
            if (formulario.producto) {
                await actualizarProducto(formulario.producto.id, datos);
                avisar("Producto actualizado");
            } else {
                await crearProducto(datos);
                avisar("Producto creado");
            }
            setFormulario(null);
            cargar();
        } catch (e) {
            setErrorForm(e.message);
        } finally {
            setGuardando(false);
        }
    };

    const confirmarEliminar = async () => {
        setEliminando(true);
        try {
            await eliminarProducto(porEliminar.id);
            avisar(`"${porEliminar.nombre}" fue eliminado`);
            setPorEliminar(null);
            cargar();
        } catch (e) {
            setError(e.message);
            setPorEliminar(null);
        } finally {
            setEliminando(false);
        }
    };

    // onEvento: si entra un pedido, el stock cambio y la tabla se actualiza sola
    return (
        <AdminLayout>
            <main className="admin-content">
                <header className="admin-topbar">
                    <div className="admin-bienvenida-texto">
                        <h1>Productos</h1>
                        <p>Añade, edita o elimina los productos de la tienda</p>
                    </div>
                    <button className="admin-usuario" onClick={() => navigate("/perfil")}>
                        <CircleUserRound size={22} />
                        <span>{usuario.nombre}</span>
                    </button>
                </header>

                {mensaje && <p className="ap-ok">{mensaje}</p>}
                {error && <p className="ap-error">{error}</p>}

                <div className="admin-tabla-card">
                    <div className="ap-cabecera">
                        <h2>Catálogo ({productos.length})</h2>
                        <button className="ap-btn" onClick={abrirNuevo}>
                            <Plus size={16} /> Nuevo producto
                        </button>
                    </div>

                    {cargando ? (
                        <p className="admin-vacio">Cargando...</p>
                    ) : productos.length === 0 ? (
                        <p className="admin-vacio">No hay productos. Crea el primero.</p>
                    ) : (
                        <div className="ap-scroll">
                            <table className="admin-tabla">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((p) => (
                                        <tr key={p.id}>
                                            <td><img className="ap-mini" src={p.imagenUrl} alt={p.nombre} /></td>
                                            <td>{p.nombre}</td>
                                            <td>{p.categoria}</td>
                                            <td>{soles(p.precio)}</td>
                                            <td>{stockTotal(p)}</td>
                                            <td className="ap-acciones">
                                                <button className="ap-icono" onClick={() => abrirEdicion(p)} aria-label={`Editar ${p.nombre}`}>
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="ap-icono peligro" onClick={() => setPorEliminar(p)} aria-label={`Eliminar ${p.nombre}`}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {formulario && (
                <div className="ap-modal-fondo" role="dialog" aria-modal="true">
                    <div className="ap-modal">
                        <h2>{formulario.producto ? "Editar producto" : "Nuevo producto"}</h2>
                        <ProductoForm
                            inicial={formulario.producto ? aFormulario(formulario.producto) : FORM_VACIO}
                            categorias={categorias}
                            guardando={guardando}
                            error={errorForm}
                            onGuardar={guardar}
                            onCancelar={() => setFormulario(null)}
                        />
                    </div>
                </div>
            )}

            {porEliminar && (
                <div className="ap-modal-fondo" role="dialog" aria-modal="true">
                    <div className="ap-modal pequeno">
                        <h2>¿Eliminar producto?</h2>
                        <p>
                            <strong>{porEliminar.nombre}</strong> dejará de mostrarse en la tienda. Los pedidos que ya
                            lo incluyen se conservan.
                        </p>
                        <div className="ap-botones">
                            <button className="ap-btn secundario" onClick={() => setPorEliminar(null)}>Cancelar</button>
                            <button className="ap-btn peligro" onClick={confirmarEliminar} disabled={eliminando}>
                                {eliminando ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminProductos;

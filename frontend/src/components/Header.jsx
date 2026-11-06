import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, CircleUserRound, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/Header.css";

function Header({ mostrarBuscador = false, busqueda = "", onBusqueda = () => {} }) {
  const { usuario } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();
  const irACuenta = () => {
    navigate(usuario ? "/perfil" : "/login");
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src="/img/Logo.png" alt="Jarusa" />
      </div>
      <nav className="header-nav">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/categorias">Categorías</Link>
        <Link to="/Nosotros">Nosotros</Link>
      </nav>
      {mostrarBuscador && (
        <div className="header-search">
          <Search />
          <input
            type="search"
            placeholder="Buscar Producto"
            aria-label="Buscar producto por nombre"
            value={busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
          />
        </div>
      )}
      <div className="header-icons">

        <button onClick={() => navigate("/carrito")} aria-label="Ir al carrito" className="header-carrito">
          <ShoppingCart />
          {cantidadTotal > 0 && <span className="header-carrito-contador">{cantidadTotal}</span>}
        </button>
        <button onClick={irACuenta}>
          <CircleUserRound />
        </button>
      </div>
    </header>
  );
}

export default Header;

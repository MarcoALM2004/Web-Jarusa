import { useNavigate } from "react-router-dom";
import { ShoppingCart, CircleUserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

function Header() {
  const { usuario } = useAuth();
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
        <a href="/">Inicio</a>
        <a href="/productos">Productos</a>
        <a href="/categorias">Categorías</a>
        <a href="/Nosotros">Nosotros</a>
      </nav>

      <div className="header-icons">

        <button>
          <ShoppingCart />
        </button>

        <button onClick={irACuenta}>
          <CircleUserRound />
        </button>

      </div>

    </header>
  );
}

export default Header;
import { useState } from 'react'
import { ShoppingCart, CircleUserRound } from "lucide-react";
import "../styles/Header.css";

function Header() {
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
          {/* No se olvide que es e icono de carrito */}
          <ShoppingCart />
        </button>

        {/* y ese de cuenta del icono*/}
        <button>
          <CircleUserRound />
        </button>

      </div>

    </header>
  );
}

export default Header;
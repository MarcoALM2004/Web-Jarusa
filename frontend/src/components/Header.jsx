import { useState } from 'react'
import { ShoppingCart, CircleUserRound } from "lucide-react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">

      <div className="header-logo">
        JΛ
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

        <button>
          <CircleUserRound />
        </button>

      </div>

    </header>
  );
}

export default Header;
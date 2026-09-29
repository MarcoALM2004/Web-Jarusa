import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Nosotros.css";


function Nosotros() {
  return (
    <>
      <Header />

      <main className="nosotros">

        <section className="nosotros-titulo">
          <h1><strong>NOSOTROS</strong></h1>
        </section>

        <section className="nosotros-principal">

          <div className="nosotros-texto">
            <h2>¿Quiénes somos?</h2>

            <p>
              Jarusa es una tienda dedicada a la venta de productos de
              maquillaje y belleza, ofreciendo una variedad de opciones para
              nuestros clientes.
            </p>

            <p>
              Buscamos brindar una experiencia de compra sencilla y agradable,
              ofreciendo productos que se adapten a diferentes gustos y
              necesidades.
            </p>
          </div>

          <div className="nosotros-imagen">
            <img src='/img/Nosotros1.png'  alt='nosotras'></img>
          </div>

        </section>

        <section className="nosotros-valores">

          <h2>Nuestros valores</h2>

          <div className="valores-grid">

            <div className="valor-card">
              <div className="valor-icono">💗</div>
              <h3>Compromiso</h3>
              <p>
                Trabajamos para ofrecer una buena experiencia a nuestros
                clientes.
              </p>
            </div>

            <div className="valor-card">
              <div className="valor-icono">✨</div>
              <h3>Calidad</h3>
              <p>
                Buscamos ofrecer productos que respondan a las necesidades de
                nuestros clientes.
              </p>
            </div>

            <div className="valor-card">
              <div className="valor-icono">🤝</div>
              <h3>Confianza</h3>
              <p>
                Promovemos relaciones basadas en el respeto y la atención.
              </p>
            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Nosotros;
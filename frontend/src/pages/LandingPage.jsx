import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/LandingPage.css";

function LandingPage() {
  return (
    <>
      <Header />

      <main className="landing">

        <div className="banner">
          <img src='/img/BannerInicio.png' alt='banner incio' />
        </div>

        <section className="section">

          <h1>Nuevas Líneas:</h1>

          <div className="lineas-container">

            <div className="linea-card">
              <img src="/img/Mansly.png" alt="Mansly" />
              <p><strong>Mansly</strong></p>
            </div>

            <div className="linea-card">
              <img src="/img/MiniTango.png" alt="Mini Tango" />
              <p><strong>Mini Tango</strong></p>
            </div>

            <div className="linea-card">
              <img src="/img/Tieesiee.png" alt="Tieesiee" />
              <p><strong>Tieesiee</strong></p>
            </div>

          </div>

        </section>

        <section className="section">

          <h1>Nuevos Productos:</h1>

          <div className="productos-container">

            <div className="producto-card">
              <img src="/img/ProdI1.png" alt="Producto" />
            </div>

            <div className="producto-card">
              <img src="/img/ProdI2.png" alt="Producto" />
            </div>

            <div className="producto-card">
              <img src="/img/ProdI3.png" alt="Producto" />
            </div>

            <div className="producto-card">
              <img src="/img/ProdI4.png" alt="Producto" />
            </div>

            <div className="producto-card">
              <img src="/img/ProdI5.png" alt="Producto" />
            </div>

            <div className="producto-card">
              <img src="/img/ProdI6.png" alt="Producto" />
            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default LandingPage;
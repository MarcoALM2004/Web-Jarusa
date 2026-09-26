import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

function Nosotros() {
  return (
    <>
      <Header />

      <main>
        <h1>Nosotros</h1>
      </main>

      <Footer />
    </>
  );
}

export default Nosotros;
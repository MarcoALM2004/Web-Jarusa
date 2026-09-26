import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <>
      <Header />

      <main>
        <h1>Landing Page</h1>
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;
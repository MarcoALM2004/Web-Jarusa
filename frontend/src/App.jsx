import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Nosotros from "./pages/Nosotros";

import "./App.css";

function App() {
  const [count, setCount] = useState(0)

return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Nosotros" element={<Nosotros />} />

      {/*PERFIL Usuario*/}

      {/* ADMIN */}
    </Routes>

  );
}

export default App

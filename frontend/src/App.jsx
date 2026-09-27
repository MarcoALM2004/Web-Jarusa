import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Administrador from "./pages/Administrador";

import "./App.css";

function App() {
  const [count, setCount] = useState(0)

return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Nosotros" element={<Nosotros />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/administrador" element={<Administrador />} />
    </Routes>

  );
}

export default App
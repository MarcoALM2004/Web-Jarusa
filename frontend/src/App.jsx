import { Routes, Route } from "react-router-dom";

import RutaProtegida from "./components/RutaProtegida";
import LandingPage from "./pages/LandingPage";
import Nosotros from "./pages/Nosotros";
import Categorias from "./pages/Categorias";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Administrador from "./pages/Administrador";
import AdminProductos from "./pages/AdminProductos";
import AdminNotificaciones from "./pages/AdminNotificaciones";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Nosotros" element={<Nosotros />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/productos/:id" element={<DetalleProducto />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route element={<RutaProtegida />}>
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route element={<RutaProtegida soloAdmin />}>
        <Route path="/administrador" element={<Administrador />} />
        <Route path="/administrador/productos" element={<AdminProductos />} />
      </Route>
      
      <Route path="/administrador/notificaciones" element={<AdminNotificaciones />} />
    </Routes>
  );
}

export default App;

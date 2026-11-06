import { BellRing, PackageX } from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import { useAdmin } from "../context/AdminContext";

import "../styles/Administrador.css";
import "../styles/AdminLayout.css";

function AdminLayout({ children }) {
    const { avisos } = useAdmin();

    return (
        <div className="admin-layout">
            <AdminSidebar />
            {children}

            <div className="admin-avisos" aria-live="polite">
                {avisos.map((a) => (
                    <div key={a.id} className={`admin-aviso ${a.tipo === "STOCK_BAJO" ? "alerta" : ""}`}>
                        {a.tipo === "STOCK_BAJO" ? <PackageX size={18} /> : <BellRing size={18} />}
                        <span>{a.texto}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminLayout;
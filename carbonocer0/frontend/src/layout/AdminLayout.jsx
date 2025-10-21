import Sidebar from "../components/SidebarAdmin";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../services/auth"; // 🟩 Importa logout del servicio
import {
  FaTachometerAlt,
  FaLightbulb,
  FaListAlt,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import SidebarAdmin from "../components/SidebarAdmin";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // 🟩 Para redirigir al login después de logout

  const links = [
    { label: "Dashboard", icon: FaTachometerAlt, path: "/admin/dashboard" },
    { label: "Empleados", icon: FaUsers, path: "/admin/empleados" },
    { label: "Actividades / Encuestas", icon: FaListAlt, path: "/admin/actividades" },
    { label: "Recomendaciones", icon: FaLightbulb, path: "/admin/recomendaciones" },
    { label: "Reportes", icon: FaChartBar, path: "/admin/reportes" },
    { label: "Configuración", icon: FaCog, path: "/admin/configuracion" },
  ];

  const handleLogout = () => {
    logout(); // 🟥 Limpia token y rol
    navigate("/", { replace: true }); // 🟩 Redirige directamente al login
  };

  return (
    <div className="flex h-screen bg-[--color-arena]">
      {/* Sidebar */}
      {sidebarOpen && <SidebarAdmin links={links} onLogout={handleLogout} />}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          title="Panel de Administración"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout} // 🟩 También desde la barra superior
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

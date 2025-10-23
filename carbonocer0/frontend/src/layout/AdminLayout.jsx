import SidebarAdmin from "../components/SidebarAdmin";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../services/auth";
import {
  FaTachometerAlt,
  FaLightbulb,
  FaListAlt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaHome
} from "react-icons/fa";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  const links = [
    { label: "Inicio", icon: FaHome, path: "/admin/inicio" }, // ✅ Corregido - icono y ruta
    { label: "Dashboard", icon: FaTachometerAlt, path: "/admin/dashboard" },
    { label: "Empleados", icon: FaUsers, path: "/admin/empleados" },
    { label: "Actividades / Encuestas", icon: FaListAlt, path: "/admin/actividades" },
    { label: "Recomendaciones", icon: FaLightbulb, path: "/admin/recomendaciones" },
    { label: "Reportes", icon: FaChartBar, path: "/admin/reportes" },
    { label: "Configuración", icon: FaCog, path: "/admin/configuracion" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Si estamos en /admin sin ruta específica, redirigir al inicio
    if (currentPath === "/admin" || currentPath === "/admin/") {
      navigate("/admin/inicio", { replace: true }); // ✅ Cambiado a "inicio"
    }
  }, [location, navigate]);

  return (
    <div className="flex h-screen bg-[--color-arena]">
      {/* Sidebar */}
      {sidebarOpen && <SidebarAdmin links={links} onLogout={handleLogout} />}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          title="Panel de Administración"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
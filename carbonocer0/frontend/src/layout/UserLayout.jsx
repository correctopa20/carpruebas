import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarUser from "../components/SidebarUser";
import Navbar from "../components/Navbar";
import { logout } from "../services/auth";
import { FaHome, FaChartBar, FaLeaf, FaCog, FaUserAlt } from "react-icons/fa";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const links = [
    { label: "Inicio", icon: FaHome, path: "/usuario/inicio" },
    { label: "Dashboard", icon: FaChartBar, path: "/usuario/dashboard" },
    { label: "Recomendaciones", icon: FaLeaf, path: "/usuario/recomendaciones" },
    { label: "Encuestas", icon: FaUserAlt, path: "/usuario/Encuesta" },
    { label: "Configuración", icon: FaCog, path: "/usuario/configuracion" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex h-screen bg-[--color-arena]">
      {/* Sidebar */}
      {sidebarOpen && <SidebarUser links={links} onLogout={handleLogout} />}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          title="Panel del Usuario"
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

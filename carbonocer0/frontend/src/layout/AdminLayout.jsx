import Sidebar from "../components/SidebarAdmin";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { 
  FaTachometerAlt, 
  FaLightbulb, 
  FaListAlt, 
  FaUsers, 
  FaChartBar, 
  FaCog 
} from "react-icons/fa";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { label: "Dashboard", icon: FaTachometerAlt, path: "/admin/dashboard" },
    { label: "Empleados", icon: FaUsers, path: "/admin/empleados" },
    { label: "Actividades / Encuestas", icon: FaListAlt, path: "/admin/actividades" },
    { label: "Recomendaciones", icon: FaLightbulb, path: "/admin/recomendaciones" },
    { label: "Reportes", icon: FaChartBar, path: "/admin/reportes" },
    { label: "Configuración", icon: FaCog, path: "/admin/configuracion" },
  ];

  return (
    <div className="flex h-screen bg-[--color-arena]">
      {sidebarOpen && <Sidebar links={links} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          title="Panel de Administración"
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  LayoutDashboard,
  Users,
  Activity,
  ClipboardList,
  BarChart2,
  Settings,
} from "lucide-react";

export default function SidebarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-[#1f3d2b] to-[#295b3a] text-white flex flex-col justify-between shadow-lg">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" /> Panel Admin
        </h2>
        <nav className="space-y-2">
          {/* INICIO */}
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a5f47] transition"
          >
            <Home className="w-4 h-4" /> Inicio
          </Link>

          {/* DASHBOARD */}
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a5f47] transition"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>

          {/* EMPLEADOS */}
          <Link
            to="/admin/empleados"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a5f47] transition"
          >
            <Users className="w-4 h-4" /> Empleados
          </Link>

          {/* ACTIVIDADES */}
          <Link
            to="/admin/actividades"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a5f47] transition"
          >
            <Activity className="w-4 h-4" /> Actividades / Encuestas
          </Link>

          {/* RECOMENDACIONES */}
          <Link
            to="/admin/recomendaciones"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a5f47] transition"
          >
            <ClipboardList className="w-4 h-4" /> Recomendaciones
          </Link>

          {/* REPORTES */}
          <Link
            to="/admin/reportes"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a5f47] transition"
          >
            <BarChart2 className="w-4 h-4" /> Reportes
          </Link>

          {/* CONFIGURACIÓN */}
          <Link
            to="/admin/configuracion"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3a5f47] transition"
          >
            <Settings className="w-4 h-4" /> Configuración
          </Link>
        </nav>
      </div>

      {/* BOTÓN SALIR */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#e74c3c] rounded-lg hover:bg-[#c0392b] transition"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>
    </aside>
  );
}

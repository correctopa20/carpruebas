import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import {
  Home,
  ClipboardList,
  BarChart2,
} from "lucide-react";
import PropTypes from "prop-types";

export default function SidebarUser({ links }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ✅ Enlaces por defecto si no se pasan como prop
  const defaultLinks = [
    { label: "Dashboard", icon: Home, path: "/user/dashboard" },
    { label: "Mi Huella", icon: BarChart2, path: "/user/mi-huella" },
    { label: "Encuesta Huella", icon: ClipboardList, path: "/user/encuesta" },
  ];

  const menuLinks = links && links.length > 0 ? links : defaultLinks;

  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col justify-between shadow-lg">
      <nav className="p-4">
        <h2 className="text-xl font-bold mb-6 text-center">CarbonoCer0 🌱</h2>

        <ul className="space-y-3">
          {menuLinks.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-500 text-black"
                      : "hover:bg-green-700/30"
                  }`
                }
              >
                <Icon />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

SidebarUser.propTypes = {
  links: PropTypes.array,
};
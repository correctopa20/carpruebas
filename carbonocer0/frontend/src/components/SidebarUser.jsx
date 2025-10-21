import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
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
import PropTypes from "prop-types"; // ✅ <-- AGREGA ESTO

export default function SidebarUser({ links }) { // ✅ además agrega links como prop
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[--color-verde-oscuro] text-white flex flex-col justify-between shadow-lg">
      <nav className="p-4">
        <h2 className="text-xl font-bold mb-6 text-center">CarbonoCer0 🌱</h2>
        <ul className="space-y-3">
          {links.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[--color-verde-claro] text-black"
                      : "hover:bg-[--color-verde-claro]/30"
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
  links: PropTypes.array.isRequired,
};

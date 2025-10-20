// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Sidebar({ user, links }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="bg-[--color-verdeOscuro] text-[--color-beige] w-56 min-h-screen flex flex-col justify-between border-r border-[--color-verdeClaro]/40 shadow-lg">
      {/* --- LOGO --- */}
      <div>
        <div className="flex items-center justify-center py-5 border-b border-[--color-verdeClaro]/40">
          <h2 className="text-lg font-bold text-[--color-verdeClaro] tracking-wide">
            🌱 Carbono Cer0
          </h2>
        </div>

        {/* --- MENÚ PRINCIPAL --- */}
        <ul className="mt-4 space-y-1">
          {links.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <li
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-5 py-2 cursor-pointer text-sm rounded-md transition-all duration-200 
                  ${
                    active
                      ? "bg-[--color-verdeClaro] text-[--color-verdeOscuro] font-semibold"
                      : "hover:bg-[--color-verdeClaro]/25 hover:text-[--color-beige]"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- BOTÓN SALIR --- */}
      <div className="p-4 border-t border-[--color-verdeClaro]/40">
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full text-left text-[--color-beige] hover:text-[--color-verdeClaro] transition"
        >
          <LogOut className="w-4 h-4" /> Salir de Cuenta
        </button>
      </div>
    </aside>
  );
}

// src/components/Navbar.jsx
import { Menu, Leaf } from "lucide-react";

export default function Navbar({ title, onToggleSidebar, user }) {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm flex justify-between items-center px-4 sm:px-6 py-3 border-b border-[--color-verdeClaro]/30">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa (solo móvil) */}
        <button
          className="block sm:hidden text-[--color-verdeOscuro] text-2xl"
          onClick={onToggleSidebar}
        >
          <Menu />
        </button>

        <h1 className="text-[--color-verdeOscuro] font-display text-lg sm:text-xl font-bold flex items-center gap-2">
          <Leaf className="text-[--color-verdeClaro]" /> {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs sm:text-sm text-[--color-gris]/70">Carbono Cer0</span>
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "empleado"}`}
          alt="Avatar"
          className="w-9 h-9 rounded-full border border-[--color-verdeClaro]/50"
        />
      </div>
    </header>
  );
}

import { useState } from "react";

export default function Navbar({ title, onToggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    onToggleSidebar(); // activa el sidebar en móviles
  };

  return (
    <header className="bg-white shadow-md flex justify-between items-center px-4 sm:px-6 py-3 border-b border-[--color-verdeClaro]/30">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa (solo en móvil) */}
        <button
          className="block sm:hidden text-[--color-verdeOscuro] text-2xl"
          onClick={toggleMenu}
        >
          ☰
        </button>

        <h1 className="text-[--color-verdeOscuro] font-display text-lg sm:text-xl font-bold flex items-center gap-2">
          🌱 <span>{title}</span>
        </h1>
      </div>

      <span className="text-xs sm:text-sm text-[--color-gris]/70">Carbono Cer0</span>
    </header>
  );
}

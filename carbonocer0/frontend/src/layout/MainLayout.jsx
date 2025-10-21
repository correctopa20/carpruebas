import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-[--color-arena]">
      {/* Navbar general (si lo quieres siempre visible) */}
      <Navbar title="CarbonoCer0" />

      {/* Aquí se renderizan las páginas */}
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

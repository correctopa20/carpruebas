import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/usuario/Dashboard";
import Encuesta from "../pages/usuario/Encuesta";
import Recomendaciones from "../pages/usuario/Recomendaciones";
import Reportes from "../pages/usuario/Reportes";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/encuesta" element={<Encuesta />} />
      <Route path="/recomendaciones" element={<Recomendaciones />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
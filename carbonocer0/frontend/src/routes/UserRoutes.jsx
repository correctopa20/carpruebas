import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import InicioUsuario from "../pages/usuario/InicioUsuario";
import Dashboard from "../pages/usuario/Dashboard";
import Encuesta from "../pages/usuario/Encuesta";
import Recomendaciones from "../pages/usuario/Recomendaciones";
import Reportes from "../pages/usuario/Reportes";
import ConfiguracionUser from "../pages/usuario/configuracionUser";

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<UserLayout/>}>
      <Route path="inicio" element={<InicioUsuario />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/encuesta" element={<Encuesta />} />
      <Route path="/recomendaciones" element={<Recomendaciones />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/configuracion" element={<ConfiguracionUser />} />
      <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
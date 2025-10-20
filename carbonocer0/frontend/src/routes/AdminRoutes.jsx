import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import EmpleadosAdmin from "../pages/Admin/EmpleadosAdmin";
import ActividadesAdmin from "../pages/Admin/ActivityAdmin";
import AdminRecommendations from "../pages/Admin/AdminRecommendations";
import ReportesAdmin from "../pages/Admin/ReportesAdmin";
import ConfiguracionAdmin from "../pages/Admin/ConfiguracionAdmin";
import InicioAdmin from "../pages/Admin/InicioAdmin"; 

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<InicioAdmin />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="empleados" element={<EmpleadosAdmin />} />
        <Route path="actividades" element={<ActividadesAdmin />} />
        <Route path="recomendaciones" element={<AdminRecommendations />} />
        <Route path="reportes" element={<ReportesAdmin />} />
        <Route path="configuracion" element={<ConfiguracionAdmin />} />
      </Route>
    </Routes>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import EmpleadosAdmin from "../pages/Admin/EmpleadosAdmin";
import ActividadesAdmin from "../pages/Admin/ActivityAdmin";
import AdminRecommendations from "../pages/Admin/AdminRecommendations";
import ReportesAdmin from "../pages/Admin/ReportesAdmin";
import ConfiguracionAdmin from "../pages/Admin/ConfiguracionAdmin";
import InicioAdmin from "../pages/Admin/InicioAdmin";
import AdminPreguntas from "../pages/Admin/AdminPreguntas";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Ruta por defecto - cuando la URL es solo /admin */}
        <Route index element={<Navigate to="inicio" replace />} />

        <Route path="inicio" element={<InicioAdmin />} />
        <Route path="preguntas" element={<AdminPreguntas />} />
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="empleados" element={<EmpleadosAdmin />} />
        <Route path="actividades" element={<ActividadesAdmin />} />
        <Route path="recomendaciones" element={<AdminRecommendations />} />
        <Route path="reportes" element={<ReportesAdmin />} />
        <Route path="configuracion" element={<ConfiguracionAdmin />} />
         {/* Ruta catch-all para cualquier otra ruta no definida */}
        <Route path="*" element={<Navigate to="inicio" replace />} />
      </Route>
    </Routes>
  );
}

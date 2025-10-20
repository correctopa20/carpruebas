import {Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/auth/Login";
import AdminRoutes from "./routes/AdminRoutes";
import Dashboard from "./pages/usuario/Dashboard";
import UserRoutes from "./routes/UserRoutes";

function App() {
  const { role, isAuthenticated } = useAuth();

    // ✅ Debug crítico
  console.log('🔐 App render - isAuthenticated:', isAuthenticated, 'role:', role);

  return (
      <Routes>
        {/* Si no está autenticado, mostrar Login en todas las rutas */}
        {!isAuthenticated ? (
          <Route path="*" element={<Login />} />
        ) : (
          /* Si está autenticado, mostrar las rutas correspondientes */
          <>
            {/* ✅ Rutas del admin */}
            {role === "admin" && (
              <Route path="/admin/*" element={<AdminRoutes />} />
            )}

            {/* ✅ Rutas del usuario normal */}
            {(role === "user" || role === "empleado") && (
              <Route path="/usuario/*" element={<UserRoutes />} />
            )}

            {/* Redirección por defecto para autenticados */}
            <Route 
              path="*" 
              element={
                <Navigate to={
                  role === "admin" ? "/admin/dashboard" : "/usuario/dashboard"
                } />
              } 
            />
          </>
        )}
      </Routes>
  );
}

export default App;
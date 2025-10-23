import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/auth/Login";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import EncuestaHuella from "./components/EncuestaHuella";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { role, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🚀 Si el usuario pierde la sesión, redirige al login
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ✅ Login público */}
      <Route path="/login" element={<Login />} />

      {/* ✅ Área ADMIN - Usa AdminRoutes que contiene todas las subrutas */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* ✅ Área USUARIO */}
      <Route
        path="/usuario/*"
        element={
          <ProtectedRoute allowedRoles={["user", "empleado"]}>
            <UserRoutes />
          </ProtectedRoute>
        }
      />

      {/* Nueva ruta para la encuesta */}
      <Route
        path="/user/encuesta"
        element={
          <ProtectedRoute>
            <EncuestaHuella />
          </ProtectedRoute>
        }
      />

      {/* ✅ Redirección por defecto - CORREGIDO */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={role === "admin" ? "/admin/dashboard" : "/usuario/inicio"}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Ruta catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
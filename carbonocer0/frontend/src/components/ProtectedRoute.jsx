// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // 🔒 Si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 🚫 Si el rol no está permitido
  if (!allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "admin" ? "/admin/inicio" : "/usuario/inicio"}
        replace
      />
    );
  }

  // ✅ Si está autenticado y autorizado
  return children;
}

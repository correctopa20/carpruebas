import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/auth/Login";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

function App() {
  const { role, isAuthenticated } = useAuth();

  console.log("🔐 App render - isAuthenticated:", isAuthenticated, "role:", role);

  return (
    <Routes>
      {/* Si no está autenticado, mostrar Login en todas las rutas */}
      {!isAuthenticated ? (
        <Route path="*" element={<Login />} />
      ) : (
        <>
          {/* ✅ Rutas del administrador */}
          {role === "admin" && <Route path="/admin/*" element={<AdminRoutes />} />}

          {/* ✅ Rutas del usuario o empleado */}
          {(role === "user" || role === "empleado") && (
            <Route path="/usuario/*" element={<UserRoutes />} />
          )}

          {/* ✅ Redirección por defecto para autenticados */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  role === "admin"
                    ? "/admin/inicio"
                    : "/usuario/inicio"
                }
              />
            }
          />
        </>
      )}
    </Routes>
  );
}

export default App;

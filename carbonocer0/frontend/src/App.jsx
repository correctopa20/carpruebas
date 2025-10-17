import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";

function App() {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        {role === "admin" ? (
          <Route path="/*" element={<DashboardAdmin />} />
        ) : (
          <Route path="/*" element={<Dashboard />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

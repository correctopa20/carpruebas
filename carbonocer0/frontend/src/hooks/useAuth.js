import { useState, useEffect } from "react";
import { getRole } from "../services/auth";

export const useAuth = () => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const storedRole = getRole();
    console.log('🔍 useAuth checking:', storedRole); // Para debug
    
    if (storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true);
    } else {
      setRole(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Verificar al cargar
    checkAuth();

    // ✅ Escuchar cambios de autenticación
    const handleAuthChange = () => {
      console.log('🔄 Auth change detected');
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange); // Por si acaso
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return { 
    role, 
    isAuthenticated,
    checkAuth // Para forzar actualización si es necesario
  };
};
// 🟥 Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  // ✅ Notificar que la autenticación cambió
  window.dispatchEvent(new Event('authChange'));
};
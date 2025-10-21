import { useState, useEffect } from "react";
import { getRole } from "../services/auth";

export const useAuth = () => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const storedRole = getRole();
    console.log("🔍 useAuth checking:", storedRole);

    if (storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true);
    } else {
      setRole(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      console.log("🔄 Auth change detected");
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return { role, isAuthenticated, loading };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event("authChange"));
};

import { useState, useEffect } from "react";
import { getRole } from "../services/auth";

export const useAuth = () => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedRole = getRole();
    if (storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  return { role, isAuthenticated };
};

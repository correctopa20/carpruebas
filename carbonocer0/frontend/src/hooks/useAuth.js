// src/hooks/useAuth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export function useAuth(requiredRole) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    const user = jwtDecode(token);
    if (requiredRole && user.rol !== requiredRole) navigate("/no-autorizado");
  }, [navigate, requiredRole]);
}

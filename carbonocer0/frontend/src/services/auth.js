// src/services/auth.js
import api from "./api";

// 🟩 Iniciar sesión
export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  const { access_token, role } = res.data;

  // 💥 LIMPIA antes de guardar
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  
  // Guardar token y rol en localStorage
  localStorage.setItem("token", access_token);
  localStorage.setItem("role", role);

  // ✅✅✅ ESTA LÍNEA ES LA MÁS IMPORTANTE - DEBE ESTAR AQUÍ
  window.dispatchEvent(new Event('authChange'));

  return { role };
};

// 🟦 Registrar nuevo usuario
export const register = async (username, email, password) => {
  const res = await api.post("/auth/register", {
    username,
    email,
    password,
    role: "empleado",
  });

  return res.data;
};

// 🟥 Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  // ✅ Notificar que la autenticación cambió
  window.dispatchEvent(new Event('authChange'));
};

// 🟨 Obtener el rol actual
export const getRole = () => localStorage.getItem("role");
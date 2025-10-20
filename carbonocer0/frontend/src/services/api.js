import axios from "axios";

// ✅ Base URL automática (usa la del backend local o la de producción si existe)
const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ✅ Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor opcional para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el token expiró o no es válido
      console.warn("Sesión expirada. Redirigiendo al login...");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/"; // redirige al login
    }
    return Promise.reject(error);
  }
);

export default api;

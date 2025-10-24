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
      console.log("🔐 Token agregado a headers:", token.substring(0, 30) + "...");
    } else {
      console.log("❌ No hay token en localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor MODIFICADO para debuggear el error 401
api.interceptors.response.use(
  (response) => {
    console.log("✅ Respuesta exitosa:", response.config.url);
    return response;
  },
  (error) => {
    console.log("=== 🚨 ERROR INTERCEPTADO ===");
    console.log("URL:", error.config?.url);
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Headers enviados:", error.config?.headers);
    console.log("Token en localStorage:", localStorage.getItem("token"));
    
    if (error.response?.status === 401) {
      console.log("🔐 Error 401 DETECTADO - Pero NO redirigiendo automáticamente");
      console.log("Mensaje del backend:", error.response?.data?.detail);
      
      // ❌ COMENTA TEMPORALMENTE LA REDIRECCIÓN PARA DEBUGGEAR
      // console.warn("Sesión expirada. Redirigiendo al login...");
      // localStorage.removeItem("token");
      // localStorage.removeItem("role");
      // window.location.href = "/"; // redirige al login
    }
    
    return Promise.reject(error);
  }
);

export default api;
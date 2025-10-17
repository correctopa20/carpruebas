import api from "./api";

export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", res.data.access_token);
  localStorage.setItem("role", res.data.role);  // 👈 Guardamos el rol
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const getRole = () => localStorage.getItem("role");

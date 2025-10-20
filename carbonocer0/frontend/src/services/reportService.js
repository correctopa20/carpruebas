// src/services/reportService.js
import api from "./api";

export const getUsersSummary = async () => {
  const res = await api.get("/reports/usuarios");
  return res.data;
};

export const getUserDetail = async (userId) => {
  const res = await api.get(`/reports/usuario/${userId}`);
  return res.data;
};

// opcional: endpoint para exportar en backend si quieres (no requerido si generas PDF en frontend)
export const exportUserReportPdfBackend = async (userId) => {
  const res = await api.get(`/reports/usuario/${userId}/pdf`, { responseType: "blob" });
  return res.data; // blob
};

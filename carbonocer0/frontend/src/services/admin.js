// src/services/admin.js
import api from "./api";

/**
 * Obtiene las estadísticas generales del panel administrador
 * (total de emisiones y resumen por actividad).
 */
export const getAdminEstadisticas = async () => {
  try {
    const res = await api.get("/admin/estadisticas");
    return res.data;
  } catch (error) {
    console.error("Error al obtener estadísticas del administrador:", error);
    throw error;
  }
};

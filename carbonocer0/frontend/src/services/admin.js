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

/**
 * Obtiene estadísticas globales avanzadas para el dashboard admin
 * (usuarios, categorías, top usuarios, distribución, etc.)
 */
export const getAdminStats = async () => {
  try {
    const res = await api.get("/admin/stats");
    return res.data;
  } catch (error) {
    console.error("Error al obtener estadísticas globales:", error);
    throw error;
  }
};

/**
 * Obtiene reporte detallado de usuarios y sus huellas
 */
export const getUsersReport = async () => {
  try {
    const res = await api.get("/reports/usuarios");
    return res.data;
  } catch (error) {
    console.error("Error al obtener reporte de usuarios:", error);
    throw error;
  }
};

/**
 * Obtiene estadísticas por categoría
 */
export const getCategoryStats = async () => {
  try {
    const res = await api.get("/reports/categorias");
    return res.data;
  } catch (error) {
    console.error("Error al obtener estadísticas por categoría:", error);
    throw error;
  }
};

/**
 * Obtiene reporte mensual de emisiones
 */
export const getMonthlyStats = async () => {
  try {
    const res = await api.get("/reports/mensual");
    return res.data;
  } catch (error) {
    console.error("Error al obtener reporte mensual:", error);
    throw error;
  }
};
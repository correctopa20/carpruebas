import api from "./api"; // tu cliente axios configurado

export const getActividades = async () => {
  const res = await api.get("/activities");
  return res.data;
};

export const crearActividad = async (actividad) => {
  const res = await api.post("/actividades", actividad);
  return res.data;
};

export const eliminarActividad = async (id) => {
  const res = await api.delete(`/actividades/${id}`);
  return res.data;
};

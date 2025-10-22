// src/services/questionService.js
import api from "./api"; // instancia Axios con baseURL y token incluido

// Obtener todas las preguntas
export const getQuestions = async () => {
  const response = await api.get("/questions/");
  return response.data;
};

// Crear una nueva pregunta (solo admin)
export const createQuestion = async (questionData) => {
  const response = await api.post("/questions/", questionData);
  return response.data;
};

// Actualizar pregunta
export const updateQuestion = async (id, updatedData) => {
  const response = await api.put(`/questions/${id}`, updatedData);
  return response.data;
};

// Eliminar pregunta
export const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};

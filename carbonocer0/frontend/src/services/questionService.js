// src/services/questionService.js
import api from "./api"; // instancia Axios con baseURL y token incluido

// 🟢 Obtener todas las preguntas
export const getQuestions = async () => {
  try {
    const response = await api.get("/questions/");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener preguntas:", error);
    throw error;
  }
};

// 🔵 Crear una nueva pregunta (solo admin)
export const createQuestion = async (questionData) => {
  try {
    const response = await api.post("/questions/", questionData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear pregunta:", error);
    throw error;
  }
};

// 🟠 Actualizar pregunta
export const updateQuestion = async (id, updatedData) => {
  try {
    const response = await api.put(`/questions/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar pregunta:", error);
    throw error;
  }
};

// 🔴 Eliminar pregunta
export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar pregunta:", error);
    throw error;
  }
};

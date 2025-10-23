// src/pages/EncuestaHuella.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getQuestions } from "../services/questionService";

export default function EncuestaHuella() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8000"; // Ajusta si tu backend usa otro puerto o URL

  // 🟢 Cargar preguntas desde el backend al montar el componente
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("❌ Error al obtener preguntas:", error);
      }
    };
    fetchQuestions();
  }, []);

  // 🟢 Manejar cambio de valor en los inputs
  const handleChange = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 🟢 Enviar respuestas al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Formato que espera tu endpoint /responses o /survey/responder
      const payload = Object.entries(responses).map(([question_id, value]) => ({
        question_id: Number(question_id),
        value: parseFloat(value),
      }));

      const res = await axios.post(`${API_URL}/responses/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setResultado(res.data);
    } catch (error) {
      console.error("❌ Error al enviar la encuesta:", error);
      alert("Ocurrió un error al calcular la huella de carbono");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-center text-green-700">
        🌱 Calcula tu huella de carbono
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-center text-gray-500">Cargando preguntas...</p>
        ) : (
          questions.map((q) => (
            <div key={q.id}>
              <label className="block font-medium mb-1">
                {q.text}
                {q.unit && <span className="text-gray-500"> ({q.unit})</span>}
              </label>
              <input
                type="number"
                value={responses[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder={`Ej: ${
                  q.unidad === "km"
                    ? "50"
                    : q.unidad === "kWh"
                    ? "120"
                    : q.unidad === "kg"
                    ? "5"
                    : ""
                }`}
                required
              />
            </div>
          ))
        )}

        <button
          type="submit"
          disabled={loading || questions.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200"
        >
          {loading ? "Calculando..." : "Calcular Huella"}
        </button>
      </form>

      {/* Resultado */}
      {resultado && Array.isArray(resultado) && resultado.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded-lg text-center">
          <h3 className="font-bold text-green-700 mb-2">
            🌍 Resultado de tu huella:
          </h3>
          <p className="text-lg">
            Total estimado:{" "}
            <span className="font-semibold">
              {resultado
                .reduce((acc, r) => acc + (r.emission || 0), 0)
                .toFixed(2)}{" "}
              kgCO₂e/mes
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

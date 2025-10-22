import React, { useState } from "react";
import axios from "axios";

export default function EncuestaHuella() {
  const [formData, setFormData] = useState({
    km_transporte: "",
    kwh_electricidad: "",
    carne_semana: "",
    ropa_anual: "",
    residuos: "",
  });

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8000"; // 🔧 Ajusta si tu backend está en otra URL o puerto

  // 🟢 Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🟢 Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/survey/responder`, formData, {
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
        {/* Transporte */}
        <div>
          <label className="block font-medium mb-1">
            🚗 Kilómetros recorridos por semana:
          </label>
          <input
            type="number"
            name="km_transporte"
            value={formData.km_transporte}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Ej: 50"
            required
          />
        </div>

        {/* Electricidad */}
        <div>
          <label className="block font-medium mb-1">
            ⚡ Consumo de electricidad (kWh/mes):
          </label>
          <input
            type="number"
            name="kwh_electricidad"
            value={formData.kwh_electricidad}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Ej: 120"
            required
          />
        </div>

        {/* Alimentación */}
        <div>
          <label className="block font-medium mb-1">
            🍖 Porciones de carne por semana:
          </label>
          <input
            type="number"
            name="carne_semana"
            value={formData.carne_semana}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Ej: 3"
            required
          />
        </div>

        {/* Ropa */}
        <div>
          <label className="block font-medium mb-1">
            👕 Prendas de ropa nuevas al año:
          </label>
          <input
            type="number"
            name="ropa_anual"
            value={formData.ropa_anual}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Ej: 10"
            required
          />
        </div>

        {/* Residuos */}
        <div>
          <label className="block font-medium mb-1">
            🗑️ Kg de residuos generados por semana:
          </label>
          <input
            type="number"
            name="residuos"
            value={formData.residuos}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Ej: 5"
            required
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200"
        >
          {loading ? "Calculando..." : "Calcular Huella"}
        </button>
      </form>

      {/* Resultado */}
      {resultado && (
        <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded-lg text-center">
          <h3 className="font-bold text-green-700 mb-2">
            🌍 Resultado de tu huella:
          </h3>
          <p className="text-lg">
            Tu huella estimada es de{" "}
            <span className="font-semibold">
              {resultado.huella_total.toFixed(2)} kgCO₂e/mes
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

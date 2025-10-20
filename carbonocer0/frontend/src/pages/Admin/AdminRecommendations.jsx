import { useEffect, useState } from "react";
import {
  getAllRecommendations,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
} from "../../services/recommendationService";

export default function AdminRecommendations() {
  const [recs, setRecs] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    impacto_estimado: 0,
  });

  const token = localStorage.getItem("token"); // el JWT del admin

  const fetchRecs = async () => {
    const data = await getAllRecommendations();
    setRecs(data);
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRecommendation(formData, token);
    await fetchRecs(); // refresca lista
    setFormData({ titulo: "", descripcion: "", categoria: "", impacto_estimado: 0 });
  };

  const handleDelete = async (id) => {
    await deleteRecommendation(id, token);
    await fetchRecs();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Panel de Recomendaciones</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Título"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <textarea
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <select
          value={formData.categoria}
          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Selecciona categoría</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
        </select>
        <input
          type="number"
          step="0.1"
          placeholder="Impacto estimado"
          value={formData.impacto_estimado}
          onChange={(e) => setFormData({ ...formData, impacto_estimado: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Agregar Recomendación
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-2">Lista de recomendaciones</h3>
      <ul className="space-y-2">
        {recs.map((r) => (
          <li key={r.id} className="border p-3 rounded flex justify-between">
            <div>
              <p className="font-bold">{r.titulo}</p>
              <p>{r.descripcion}</p>
              <small className="text-gray-500">Categoría: {r.categoria}</small>
            </div>
            <button
              onClick={() => handleDelete(r.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchRecs = async () => {
    try {
      setLoading(true);
      const data = await getAllRecommendations();
      setRecs(data);
    } catch (error) {
      console.error("Error cargando recomendaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Modo edición
        await updateRecommendation(editingId, formData, token);
      } else {
        // Modo creación
        await createRecommendation(formData, token);
      }
      await fetchRecs();
      resetForm();
    } catch (error) {
      console.error("Error guardando recomendación:", error);
    }
  };

  const handleEdit = (rec) => {
    setFormData({
      titulo: rec.titulo,
      descripcion: rec.descripcion,
      categoria: rec.categoria,
      impacto_estimado: rec.impacto_estimado,
    });
    setEditingId(rec.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta recomendación?")) {
      try {
        await deleteRecommendation(id, token);
        await fetchRecs();
      } catch (error) {
        console.error("Error eliminando recomendación:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      categoria: "",
      impacto_estimado: 0,
    });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Panel de Recomendaciones</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold">
          {editingId ? "Editar Recomendación" : "Agregar Nueva Recomendación"}
        </h3>
        
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
          rows="3"
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
          <option value="general">General</option>
        </select>
        <input
          type="number"
          step="0.1"
          placeholder="Impacto estimado (%)"
          value={formData.impacto_estimado}
          onChange={(e) => setFormData({ ...formData, impacto_estimado: parseFloat(e.target.value) || 0 })}
          className="border p-2 rounded w-full"
          min="0"
          max="100"
          required
        />
        
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? "Actualizar" : "Agregar"} Recomendación
          </button>
          
          {editingId && (
            <button 
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de recomendaciones */}
      <h3 className="text-xl font-semibold mb-4">Lista de Recomendaciones</h3>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p>Cargando recomendaciones...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recs.map((rec) => (
            <div key={rec.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800">{rec.titulo}</h4>
                  <p className="text-gray-600 mt-1">{rec.descripcion}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Categoría: {rec.categoria}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Impacto: {rec.impacto_estimado}%
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Creado: {new Date(rec.fecha_creacion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(rec)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && recs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay recomendaciones registradas
        </div>
      )}
    </div>
  );
}
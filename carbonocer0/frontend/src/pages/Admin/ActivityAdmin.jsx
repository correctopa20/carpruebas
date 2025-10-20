import { useEffect, useState } from "react";
import {
  getActividades,
  crearActividad,
  eliminarActividad,
} from "../../services/activitys";

export default function ActividadesAdmin() {
  const [actividades, setActividades] = useState([]);
  const [nueva, setNueva] = useState({
    nombre: "",
    tipo: "",
    descripcion: "",
    factor_emision: 0,
  });

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      const data = await getActividades();
      setActividades(data);
    } catch (err) {
      console.error("Error al cargar actividades:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearActividad(nueva);
      setNueva({ nombre: "", tipo: "", descripcion: "", factor_emision: 0 });
      cargarActividades();
    } catch (err) {
      console.error("Error al crear actividad:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminarActividad(id);
      cargarActividades();
    } catch (err) {
      console.error("Error al eliminar actividad:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🧾 Gestión de Actividades / Encuestas</h1>

      {/* Formulario de creación */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-3"
      >
        <input
          className="border p-2 w-full rounded"
          placeholder="Nombre de la actividad"
          value={nueva.nombre}
          onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
          required
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Tipo de actividad"
          value={nueva.tipo}
          onChange={(e) => setNueva({ ...nueva, tipo: e.target.value })}
          required
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Descripción"
          value={nueva.descripcion}
          onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
          required
        />

        <input
          className="border p-2 w-full rounded"
          type="number"
          placeholder="Factor de emisión (kg CO₂ por unidad)"
          value={nueva.factor_emision}
          onChange={(e) =>
            setNueva({ ...nueva, factor_emision: parseFloat(e.target.value) })
          }
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Agregar Actividad
        </button>
      </form>

      {/* Tabla de actividades */}
      <table className="w-full border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Descripción</th>
            <th className="p-2 text-left">Factor de Emisión (kg CO₂)</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actividades.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No hay actividades registradas.
              </td>
            </tr>
          ) : (
            actividades.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{a.nombre}</td>
                <td className="p-2">{a.tipo}</td>
                <td className="p-2">{a.descripcion}</td>
                <td className="p-2">{a.factor_emision}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

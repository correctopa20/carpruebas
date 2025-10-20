import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { getAdminEstadisticas } from "../../services/admin";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const data = await getAdminEstadisticas();
        setStats(data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };
    fetchEstadisticas();
  }, []);

  if (!stats)
    return <p className="text-center text-gray-500 mt-10">Cargando estadísticas...</p>;

  const labels = Object.keys(stats.resumen_por_actividad);
  const valores = Object.values(stats.resumen_por_actividad);

  const barData = {
    labels,
    datasets: [
      {
        label: "Emisiones por tipo (kg CO₂)",
        data: valores,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor: [
          "#22c55e",
          "#16a34a",
          "#4ade80",
          "#86efac",
          "#15803d",
          "#84cc16",
          "#65a30d",
        ],
      },
    ],
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-center">🌍 Estadísticas Generales</h1>

      <p className="text-lg text-center">
        Total de emisiones registradas:{" "}
        <span className="font-bold text-blue-600">
          {stats.total_emisiones.toFixed(2)} kg CO₂
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Emisiones por Tipo de Actividad",
                  color: "#222",
                  font: { size: 18 },
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Doughnut
            data={pieData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Distribución porcentual de emisiones",
                  color: "#222",
                  font: { size: 18 },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

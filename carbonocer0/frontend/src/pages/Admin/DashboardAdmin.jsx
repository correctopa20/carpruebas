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
import { getAdminStats, getAdminEstadisticas } from "../../services/admin";
import Card from "../../components/Card";
import { 
  FaUsers, 
  FaChartBar, 
  FaLeaf, 
  FaUserCheck,
  FaExclamationTriangle
} from "react-icons/fa";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Usar el nuevo endpoint de stats globales
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
        // Fallback al endpoint antiguo si es necesario
        try {
          const fallbackData = await getAdminEstadisticas();
          setStats(fallbackData);
        } catch (fallbackError) {
          console.error("Error con endpoint de fallback:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[--color-verdeMedio] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas globales...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  // Adaptar según la estructura de datos que recibas
  const { summary, categories, top_users, emission_levels } = stats;

  // Datos para gráficos (adaptables a diferentes estructuras de respuesta)
  const categoryData = {
    labels: categories ? Object.keys(categories) : Object.keys(stats.resumen_por_actividad || {}),
    datasets: [
      {
        label: "Emisiones Totales (kg CO₂)",
        data: categories ? 
          Object.values(categories).map(cat => cat.total_emission) : 
          Object.values(stats.resumen_por_actividad || {}),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(22, 163, 74, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[--color-verdeOscuro]">🌍 Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">
          Visión global del sistema de huella de carbono
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Usuarios" 
          value={summary?.total_users || "0"}
          description="Usuarios registrados"
          color="blue"
          icon={FaUsers}
        />
        <Card 
          title="Emisiones Totales" 
          value={`${summary?.total_emissions || stats?.total_emisiones || 0} kg CO₂`}
          description="Huella total calculada"
          color="green"
          icon={FaLeaf}
        />
        <Card 
          title="Participación" 
          value={`${summary ? 
            Math.round((summary.total_responses / summary.total_users) * 100) : 
            0}%`}
          description="Usuarios activos"
          color="purple"
          icon={FaUserCheck}
        />
        <Card 
          title="Huella Alta" 
          value={emission_levels?.alto || "0"}
          description="Usuarios con huella elevada"
          color="orange"
          icon={FaExclamationTriangle}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-md border border-[--color-verdeClaro]/30 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-center text-[--color-verdeOscuro]">
            📊 Emisiones por Categoría
          </h3>
          <Bar 
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[--color-verdeClaro]/30 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-center text-[--color-verdeOscuro]">
            🌱 Distribución
          </h3>
          <Doughnut 
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
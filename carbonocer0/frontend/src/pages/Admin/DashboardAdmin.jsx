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
import { getAdminStats } from "../../services/admin"; // ✅ Solo importar el principal
import Card from "../../components/Card";
import { 
  FaUsers, 
  FaLeaf, 
  FaUserCheck,
  FaExclamationTriangle,
  FaFilePdf,
  FaDownload
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
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("🔄 [DASHBOARD] Iniciando carga de estadísticas...");
        
        // ✅ Usar SOLO el endpoint principal unificado
        const data = await getAdminStats();
        console.log("✅ [DASHBOARD] Datos recibidos correctamente");
        setStats(data);
        setError(null);
        
      } catch (error) {
        console.error("❌ [DASHBOARD] Error cargando estadísticas:", error);
        setError(`No se pudieron cargar las estadísticas: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // 🔥 FUNCIÓN PARA EXPORTAR PDF
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token");
      
      console.log("📤 Iniciando exportación de PDF...");
      
      const response = await fetch("http://localhost:8000/admin/export-report", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      
      // Obtener nombre del archivo del header o usar uno por defecto
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "reporte_carbonocer0.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("✅ PDF exportado exitosamente");

    } catch (error) {
      console.error("❌ Error exportando PDF:", error);
      alert("Error al exportar el reporte. Intenta nuevamente.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas globales...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          <p className="font-bold">Error</p>
          <p>{error || "No se pudieron cargar las estadísticas"}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Extraer datos con valores por defecto
  const { 
    summary = {}, 
    categories = {}, 
    top_users = [], 
    emission_levels = {} 
  } = stats;

  // Datos para gráfico de categorías
  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Emisiones Totales (kg CO₂)",
        data: Object.values(categories).map(cat => cat.total_emission),
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(59, 130, 246, 0.7)", 
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)"
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)", 
          "rgba(139, 92, 246, 1)"
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Datos para gráfico de distribución de usuarios
  const userDistributionData = {
    labels: ['Con respuestas', 'Sin respuestas'],
    datasets: [
      {
        data: [
          summary.users_with_responses || 0,
          summary.users_without_responses || 0
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(156, 163, 175, 0.7)"
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(156, 163, 175, 1)"
        ],
        borderWidth: 2,
      },
    ],
  };

  // Datos para niveles de emisión
  const emissionLevelsData = {
    labels: ['Baja', 'Media', 'Alta'],
    datasets: [
      {
        label: 'Usuarios por nivel',
        data: [
          emission_levels.bajo || 0,
          emission_levels.medio || 0, 
          emission_levels.alto || 0
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)"
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header con botón de exportar */}
      <div className="flex justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-800">🌍 Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">
            Visión global del sistema de huella de carbono
          </p>
        </div>
        
        {/* Botón de exportar PDF */}
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generando PDF...</span>
            </>
          ) : (
            <>
              <FaFilePdf size={18} />
              <span>Exportar PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Información del reporte */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FaDownload className="text-blue-500 mt-1" size={18} />
          <div>
            <h4 className="font-semibold text-blue-800">¿Qué incluye el reporte PDF?</h4>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• Resumen general de estadísticas</li>
              <li>• Top 5 usuarios con mayor huella de carbono</li>
              <li>• Distribución por categorías (transporte, energía, etc.)</li>
              <li>• Fecha y hora de generación del reporte</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Usuarios" 
          value={summary.total_users || 0}
          description="Usuarios registrados"
          color="blue"
          icon={FaUsers}
        />
        <Card 
          title="Emisiones Totales" 
          value={`${summary.total_emissions || 0} kg CO₂`}
          description="Huella total calculada"
          color="green"
          icon={FaLeaf}
        />
        <Card 
          title="Participación" 
          value={`${summary.users_with_responses || 0}/${summary.total_users || 0}`}
          description="Usuarios con respuestas"
          color="purple"
          icon={FaUserCheck}
        />
        <Card 
          title="Huella Alta" 
          value={emission_levels.alto || 0}
          description="Usuarios con huella elevada"
          color="orange"
          icon={FaExclamationTriangle}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emisiones por categoría */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
            📊 Emisiones por Categoría
          </h3>
          <Bar 
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* Distribución de usuarios */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
            👥 Participación de Usuarios
          </h3>
          <Doughnut 
            data={userDistributionData}
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

        {/* Niveles de emisión */}
        <div className="bg-white p-6 rounded-2xl shadow-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
            📈 Niveles de Huella de Carbono
          </h3>
          <Bar 
            data={emissionLevelsData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Top usuarios */}
      {top_users.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            🏆 Top 5 Usuarios con Mayor Huella
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Usuario</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-right">Huella Total (kg CO₂)</th>
                </tr>
              </thead>
              <tbody>
                {top_users.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      {user.total_emission?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
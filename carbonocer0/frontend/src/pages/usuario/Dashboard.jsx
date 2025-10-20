import { useEffect, useState } from "react";
import api from "../../services/api";
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
import Card from "../../components/Card";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

// Importa íconos (usa los que tengas disponibles)
import { 
  Home, 
  FileText, 
  Lightbulb, 
  BarChart3 
} from "lucide-react";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function Dashboard() {
  const [actividades, setActividades] = useState([]);
  const [huella, setHuella] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAct = await api.get("/activities/mis-actividades");
        setActividades(resAct.data);
        const resHuella = await api.get("/activities/mi-huella");
        setHuella(resHuella.data.huella_total_kgCO2);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Agrega íconos a cada link
  const links = [
  { label: "Inicio", icon: Home, path: "/usuario/dashboard" },
  { label: "Encuesta", icon: FileText, path: "/usuario/encuesta" },
  { label: "Recomendaciones", icon: Lightbulb, path: "/usuario/recomendaciones" },
  { label: "Reportes", icon: BarChart3, path: "/usuario/reportes" },
];

  const barData = {
    labels: actividades.map((a) => a.tipo),
    datasets: [
      {
        label: "Emisiones (kg CO₂)",
        data: actividades.map((a) => a.total_emision),
        backgroundColor: "rgba(34,197,94,0.7)",
        borderColor: "rgba(22,163,74,1)",
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "📊 Emisiones por Actividad",
        color: "#14532d",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: { ticks: { color: "#333" } },
      y: { ticks: { color: "#333" } },
    },
  };

  const doughnutData = {
    labels: actividades.map((a) => a.tipo),
    datasets: [
      {
        data: actividades.map((a) => a.total_emision),
        backgroundColor: [
          "#22c55e",
          "#16a34a",
          "#4ade80",
          "#86efac",
          "#15803d",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="flex bg-green-50 min-h-screen">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 sm:hidden" onClick={toggleSidebar}></div>
      )}
      <div
        className={`fixed sm:static z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition duration-300`}
      >
        <Sidebar links={links} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Navbar title="Panel del Empleado" onToggleSidebar={toggleSidebar} />

        <main className="p-6 space-y-8">
          {/* Resumen con Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Huella total" desc={`${huella.toFixed(2)} kg CO₂`} />
            <Card
              title="Actividades registradas"
              desc={`${actividades.length}`}
            />
            <Card
              title="Promedio por actividad"
              desc={
                actividades.length
                  ? `${(huella / actividades.length).toFixed(2)} kg CO₂`
                  : "0 kg CO₂"
              }
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
              {actividades.length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <p className="text-gray-500 text-center">
                  Aún no tienes actividades registradas.
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold text-green-700 mb-4 text-center">
                🌱 Distribución de Emisiones
              </h3>
              {actividades.length > 0 ? (
                <Doughnut data={doughnutData} />
              ) : (
                <p className="text-gray-500 text-center">
                  Aún no hay datos para mostrar.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

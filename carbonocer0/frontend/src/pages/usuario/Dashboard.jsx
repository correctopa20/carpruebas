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
import api from "../../services/api";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function MiHuella() {
  const [footprintData, setFootprintData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 MiHuella component mounted");
    cargarHuella();
  }, []);

  const cargarHuella = async () => {
    try {
      setDebugInfo("🔄 Iniciando carga de huella...");
      console.log("🔄 Haciendo petición GET a /users/my-footprint");
      
      const token = localStorage.getItem("token");
      console.log("🔑 Token en localStorage:", token ? "✅ Existe" : "❌ No existe");
      
      const response = await api.get("/users/my-footprint");
      console.log("✅ Respuesta recibida del backend:", response);
      console.log("📊 Datos de la respuesta:", response.data);
      
      setDebugInfo(`✅ Respuesta exitosa. Datos: ${JSON.stringify(response.data).substring(0, 150)}...`);
      setFootprintData(response.data);
      setError(null);
      
    } catch (error) {
      console.error("❌ ERROR en cargarHuella:", error);
      console.log("📋 Detalles completos del error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      const errorMsg = `❌ Error ${error.response?.status || "sin status"}: ${error.response?.data?.detail || error.message || "Error desconocido"}`;
      setDebugInfo(errorMsg);
      setError(errorMsg);
      
      if (error.response?.status === 404) {
        console.log("📭 Error 404 - Usuario no encontrado o sin encuesta");
        setFootprintData(null);
      } else if (error.response?.status === 401) {
        console.log("🔐 Error 401 - No autorizado, token inválido");
        setFootprintData(null);
      } else if (error.response?.status === 500) {
        console.log("💥 Error 500 - Error interno del servidor");
        setFootprintData(null);
      }
    } finally {
      console.log("🏁 Finalizando carga de huella");
      setLoading(false);
    }
  };

  // Debug: mostrar estado actual
  console.log("📊 Estado actual:", {
    loading,
    footprintData,
    debugInfo,
    error,
    hasCategories: footprintData?.categories ? Object.keys(footprintData.categories).length : 0
  });

  if (loading) {
    console.log("⏳ Mostrando loading...");
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu huella de carbono...</p>
          {debugInfo && <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>}
        </div>
      </div>
    );
  }

  // Mostrar información de debug temporalmente (puedes quitarlo después)
  const showDebugPanel = false;

  if (error) {
    console.log("❌ Mostrando pantalla de error:", error);
    return (
      <div className="space-y-6 p-6">
        {showDebugPanel && (
          <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg">
            <h3 className="font-bold text-yellow-800">🔍 PANEL DE DEBUG</h3>
            <p className="text-yellow-700">{debugInfo}</p>
            <button 
              onClick={() => {
                console.clear();
                cargarHuella();
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
            >
              Recargar y limpiar consola
            </button>
          </div>
        )}
        
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🌍 Error al cargar tu huella</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
          <p className="text-gray-600 mb-6">No se pudieron cargar tus datos de huella de carbono</p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate("/usuario/encuesta")}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Realizar Encuesta
            </button>
            <button 
              onClick={cargarHuella}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!footprintData || !footprintData.categories || 
    typeof footprintData.categories !== 'object' || 
    Object.keys(footprintData.categories).length === 0) {
    
    console.log("📭 Mostrando pantalla 'sin encuesta'", {
        footprintData,
        categoriesType: typeof footprintData?.categories,
        categoriesKeys: footprintData?.categories ? Object.keys(footprintData.categories) : 'no categories'
    });
    return (
      <div className="space-y-6 p-6">
        {showDebugPanel && (
          <div className="bg-blue-100 border border-blue-400 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800">🔍 PANEL DE DEBUG</h3>
            <p className="text-blue-700">{debugInfo}</p>
            <p className="text-blue-700">footprintData: {JSON.stringify(footprintData)}</p>
          </div>
        )}
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🌍 Tu Huella de Carbono</h2>
          <p className="text-gray-600 mb-6">Aún no has completado la encuesta de huella de carbono</p>
          <button 
            onClick={() => navigate("/usuario/encuesta")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Realizar Encuesta
          </button>
        </div>
      </div>
    );
  }

  // ✅ MOVER LA DESTRUCTURACIÓN AQUÍ - DESPUÉS de verificar que los datos existen
  console.log("🎉 Mostrando datos de huella:", footprintData);
  const { categories, total_emissions, breakdown, total_responses, average_emission } = footprintData;

  // Validaciones adicionales para seguridad
  if (!categories || typeof categories !== 'object') {
    console.error("❌ categories no es un objeto válido:", categories);
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error en los datos</h2>
        <p className="text-gray-600">Los datos de categorías no son válidos</p>
      </div>
    );
  }

  const categoryKeys = Object.keys(categories);
  const categoryValues = Object.values(categories);

  if (categoryKeys.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay datos para mostrar</h2>
        <p className="text-gray-600">No se encontraron datos de categorías</p>
      </div>
    );
  }

  // Datos para gráficos
  const barData = {
    labels: categoryKeys,
    datasets: [
      {
        label: "Emisiones por categoría (kg CO₂)",
        data: categoryValues,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: breakdown?.map(item => item.category) || [],
    datasets: [
      {
        data: breakdown?.map(item => item.emissions) || [],
        backgroundColor: [
          "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
          "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#14b8a6"
        ],
        borderColor: "#fff",
        borderWidth: 3,
      },
    ],
  };

  // Recomendaciones basadas en categorías
  const recomendaciones = {
    "transporte": [
      "🚗 Usa transporte público o comparte vehículo",
      "🚲 Considera la bicicleta para distancias cortas",
      "✈️ Reduce viajes en avión cuando sea posible"
    ],
    "energia": [
      "💡 Usa bombillas LED y apaga luces innecesarias",
      "🔌 Desconecta electrodomésticos en standby",
      "☀️ Aprovecha la luz natural"
    ],
    "alimentacion": [
      "🥦 Consume más alimentos locales y de temporada",
      "🍖 Reduce el consumo de carne roja",
      "🚯 Evita el desperdicio de alimentos"
    ],
    "hogar": [
      "🏠 Mejora el aislamiento de tu vivienda",
      "🌡️ Regula la temperatura de forma eficiente",
      "💧 Reduce el consumo de agua caliente"
    ]
  };

  return (
    <div className="space-y-8 p-6">
      {showDebugPanel && (
        <div className="bg-green-100 border border-green-400 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">🔍 PANEL DE DEBUG - DATOS CARGADOS</h3>
          <p className="text-green-700">{debugInfo}</p>
          <p className="text-green-700">Total emisiones: {total_emissions} | Respuestas: {total_responses}</p>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">🌍 Tu Huella de Carbono</h1>
        <p className="text-gray-600 mt-2">
          Resumen de tus emisiones basado en la encuesta completada
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Huella Total" 
          value={`${total_emissions} kg CO₂`}
          description="Emisiones totales calculadas"
          color="blue"
        />
        <Card 
          title="Actividades Registradas" 
          value={total_responses}
          description="Respuestas en la encuesta"
          color="green"
        />
        <Card 
          title="Promedio por Actividad" 
          value={`${average_emission} kg CO₂`} 
          description="Emisión promedio por respuesta"
          color="purple"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Bar 
            data={barData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Emisiones por Categoría",
                  font: { size: 16, weight: 'bold' }
                },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Doughnut 
            data={doughnutData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                },
                title: {
                  display: true,
                  text: "Distribución Porcentual",
                  font: { size: 16, weight: 'bold' }
                },
              },
            }}
          />
        </div>
      </div>

      {/* Desglose detallado */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">📊 Desglose Detallado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(breakdown || []).map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-800 capitalize">{item.category}</h4>
              <p className="text-2xl font-bold text-blue-600">{item.emissions} kg CO₂</p>
              <p className="text-gray-600">{item.percentage}% del total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-green-50 p-6 rounded-2xl shadow-lg border border-green-200">
        <h3 className="text-xl font-semibold mb-4 text-green-800">💡 Recomendaciones para Reducir tu Huella</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(recomendaciones).map(([categoria, consejos]) => (
            categories[categoria] > 0 && (
              <div key={categoria} className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 capitalize">{categoria}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {consejos.map((consejo, idx) => (
                    <li key={idx}>{consejo}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="text-center">
        <button 
          onClick={() => navigate("/usuario/encuesta")}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 mr-4 transition duration-200"
        >
          🔄 Actualizar Encuesta
        </button>
        <button 
          onClick={cargarHuella}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          🔃 Actualizar Datos
        </button>
      </div>
    </div>
  );
}
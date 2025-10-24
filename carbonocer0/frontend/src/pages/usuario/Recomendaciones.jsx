import { useEffect, useState } from "react";
import { 
  FaLightbulb, 
  FaLeaf, 
  FaCar, 
  FaHome, 
  FaUtensils, 
  FaBolt,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

export default function Recomendaciones() {
  const [recomendaciones, setRecomendaciones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarRecomendaciones = async () => {
      try {
        console.log("🔄 Cargando recomendaciones personalizadas...");
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:8000/recommendations/sugeridas", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Recomendaciones recibidas:", data);
        setRecomendaciones(data);
        setError(null);
        
      } catch (error) {
        console.error("❌ Error cargando recomendaciones:", error);
        setError("No se pudieron cargar las recomendaciones personalizadas");
      } finally {
        setLoading(false);
      }
    };

    cargarRecomendaciones();
  }, []);

  // Función para obtener icono según categoría
  const getIconoPorCategoria = (categoria) => {
    const categoriaLower = categoria.toLowerCase();
    
    if (categoriaLower.includes('transporte') || categoriaLower.includes('vehículo')) {
      return <FaCar className="text-blue-500 text-xl" />;
    } else if (categoriaLower.includes('energía') || categoriaLower.includes('electricidad')) {
      return <FaBolt className="text-yellow-500 text-xl" />;
    } else if (categoriaLower.includes('hogar') || categoriaLower.includes('casa')) {
      return <FaHome className="text-green-500 text-xl" />;
    } else if (categoriaLower.includes('alimentación') || categoriaLower.includes('comida')) {
      return <FaUtensils className="text-red-500 text-xl" />;
    } else {
      return <FaLightbulb className="text-purple-500 text-xl" />;
    }
  };

  // Función para obtener color según nivel de huella
  const getColorNivel = (nivel) => {
    switch (nivel.toLowerCase()) {
      case 'bajo':
        return 'text-green-600 bg-green-100';
      case 'medio':
        return 'text-yellow-600 bg-yellow-100';
      case 'alto':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Analizando tu huella de carbono...</p>
          <p className="text-sm text-gray-500">Buscando recomendaciones personalizadas</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          <FaExclamationTriangle className="inline-block mr-2" />
          <span className="font-bold">Error</span>
          <p className="mt-2">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!recomendaciones || !recomendaciones.recomendaciones || recomendaciones.recomendaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <FaLightbulb className="text-4xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No hay recomendaciones disponibles</h2>
        <p className="text-gray-500">Completa la encuesta de huella de carbono para recibir recomendaciones personalizadas.</p>
      </div>
    );
  }

  const { huella_total_kgCO2, nivel, recomendaciones: listaRecomendaciones } = recomendaciones;

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header con resumen de huella */}
      <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 shadow-sm">
        <div className="flex justify-center items-center mb-4">
          <FaLeaf className="text-4xl text-green-500 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">💡 Recomendaciones Personalizadas</h1>
            <p className="text-gray-600 mt-2">Basadas en tu huella de carbono actual</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Huella Total:</span>
              <span className="text-2xl font-bold text-green-600">{huella_total_kgCO2} kg CO₂</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Nivel:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorNivel(nivel)}`}>
                {nivel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FaChartLine className="mr-3 text-green-500" />
            Acciones Recomendadas
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {listaRecomendaciones.length} recomendaciones
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listaRecomendaciones.map((rec, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getIconoPorCategoria(rec.categoria)}
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{rec.titulo}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {rec.categoria}
                      </span>
                    </div>
                  </div>
                  <FaCheckCircle className="text-green-400 text-xl" />
                </div>

                {/* Descripción */}
                <p className="text-gray-600 mb-4 leading-relaxed">{rec.descripcion}</p>

                {/* Impacto estimado */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Impacto estimado:</span>
                  <span className="text-green-600 font-semibold">
                    -{rec.impacto_estimado} kg CO₂
                  </span>
                </div>

                {/* Prioridad visual */}
                <div className="mt-4 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(rec.impacto_estimado * 2, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    Alta prioridad
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de tips adicionales */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
          <FaLightbulb className="mr-2" />
          Tips Adicionales para Reducir tu Huella
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaLeaf className="text-blue-500" />
            </div>
            <p className="text-blue-700">Realiza seguimiento mensual de tu progreso</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaChartLine className="text-blue-500" />
            </div>
            <p className="text-blue-700">Establece metas realistas de reducción</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaHome className="text-blue-500" />
            </div>
            <p className="text-blue-700">Comparte tus logros con familia y amigos</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaUtensils className="text-blue-500" />
            </div>
            <p className="text-blue-700">Celebra cada reducción, por pequeña que sea</p>
          </div>
        </div>
      </div>

      {/* Llamada a la acción */}
      <div className="text-center bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">¿Listo para reducir tu huella?</h3>
        <p className="mb-6 opacity-90">Implementa estas recomendaciones y monitorea tu progreso</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
        >
          Actualizar Progreso
        </button>
      </div>
    </div>
  );
}
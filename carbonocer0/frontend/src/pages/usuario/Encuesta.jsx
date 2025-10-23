import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./EncuestaUsuario.css";

export default function EncuestaUsuario() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPreguntas();
  }, []);

  const cargarPreguntas = async () => {
    try {
      const response = await api.get("/questions/");
      setPreguntas(response.data);
      
      // Inicializar respuestas
      const initialRespuestas = {};
      response.data.forEach(pregunta => {
        initialRespuestas[pregunta.id] = "";
      });
      setRespuestas(initialRespuestas);
    } catch (error) {
      console.error("Error cargando preguntas:", error);
      alert("Error al cargar la encuesta");
    }
  };

  const handleChange = (id, value) => {
    setRespuestas(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const enviarEncuesta = async () => {
    // Validar que todas las preguntas estén respondidas
    const respuestasArray = Object.entries(respuestas)
      .filter(([_, value]) => value !== "" && !isNaN(value) && parseFloat(value) >= 0)
      .map(([id, value]) => ({
        question_id: parseInt(id),
        value: parseFloat(value)
      }));

    if (respuestasArray.length !== preguntas.length) {
      alert("Por favor responde todas las preguntas con valores válidos");
      return;
    }

    setLoading(true);
    try {
      await api.post("/responses/", respuestasArray);
      alert("✅ Encuesta enviada correctamente");
      navigate("/usuario/dashboard");
    } catch (error) {
      console.error("Error enviando respuestas:", error);
      alert("Error al enviar la encuesta");
    } finally {
      setLoading(false);
    }
  };

  const calcularEmision = (preguntaId, valor) => {
    if (!valor || isNaN(valor)) return 0;
    const pregunta = preguntas.find(p => p.id === preguntaId);
    return pregunta ? (parseFloat(valor) * pregunta.factor).toFixed(2) : 0;
  };

  if (preguntas.length === 0) {
    return (
      <div className="encuesta-container">
        <div className="loading">Cargando encuesta...</div>
      </div>
    );
  }

  return (
    <div className="encuesta-container">
      <div className="encuesta-header">
        <h1>🌍 Encuesta de Huella de Carbono</h1>
        <p>Responde las siguientes preguntas para calcular tu huella de carbono</p>
      </div>

      <div className="preguntas-grid">
        {preguntas.map(pregunta => (
          <div key={pregunta.id} className="pregunta-card">
            <div className="pregunta-header">
              <h3>{pregunta.text}</h3>
              <span className="categoria-badge">{pregunta.category}</span>
            </div>
            
            <div className="pregunta-info">
              <p>Unidad: <strong>{pregunta.unit}</strong></p>
              <p>Factor de emisión: <strong>{pregunta.factor} kg CO₂/{pregunta.unit}</strong></p>
            </div>

            <div className="input-group">
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder={`Ingresa cantidad en ${pregunta.unit}`}
                value={respuestas[pregunta.id] || ""}
                onChange={(e) => handleChange(pregunta.id, e.target.value)}
                className="respuesta-input"
              />
              
              {respuestas[pregunta.id] && (
                <div className="emision-calculada">
                  Emisión estimada: <strong>{calcularEmision(pregunta.id, respuestas[pregunta.id])} kg CO₂</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="encuesta-actions">
        <button 
          onClick={enviarEncuesta} 
          disabled={loading}
          className="btn-enviar"
        >
          {loading ? "Enviando..." : "📤 Enviar Encuesta"}
        </button>
        
        <button 
          onClick={() => navigate("/usuario/inicio")}
          className="btn-cancelar"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPreguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [nueva, setNueva] = useState({ text: "", category: "", unit: "", factor: "" });

  useEffect(() => {
    axios.get("http://localhost:8000/questions/").then(res => setPreguntas(res.data));
  }, []);

  const crearPregunta = async () => {
    await axios.post("http://localhost:8000/questions/", nueva);
    const res = await axios.get("http://localhost:8000/questions/");
    setPreguntas(res.data);
    setNueva({ text: "", category: "", unit: "", factor: "" });
  };

  return (
    <div>
      <h2>Preguntas del Cuestionario</h2>
      <ul>
        {preguntas.map(p => (
          <li key={p.id}>{p.text} ({p.category})</li>
        ))}
      </ul>
      <input placeholder="Texto" onChange={e => setNueva({ ...nueva, text: e.target.value })} />
      <input placeholder="Categoría" onChange={e => setNueva({ ...nueva, category: e.target.value })} />
      <input placeholder="Unidad" onChange={e => setNueva({ ...nueva, unit: e.target.value })} />
      <input placeholder="Factor" type="number" onChange={e => setNueva({ ...nueva, factor: e.target.value })} />
      <button onClick={crearPregunta}>Agregar</button>
    </div>
  );
}

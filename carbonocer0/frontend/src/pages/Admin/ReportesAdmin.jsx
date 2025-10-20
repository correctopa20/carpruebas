// src/pages/Admin/AdminReports.jsx
import { useEffect, useState } from "react";
import { getUsersSummary, getUserDetail } from "../../services/reportService";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ReportesAdmin() {
  const [summary, setSummary] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = async () => {
    try {
      const data = await getUsersSummary();
      setSummary(data);
    } catch (e) { console.error(e); }
  };

  useEffect(()=>{ load(); }, []);

  const showDetail = async (userId) => {
    try {
      const d = await getUserDetail(userId);
      setSelected(userId);
      setDetail(d);
    } catch (e) { console.error(e); }
  };

  const exportUserPdf = (userReport) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Reporte usuario: ${userReport.usuario.username}`, 14, 22);

    doc.setFontSize(12);
    doc.text(`Total emisiones: ${userReport.total_emision_kgCO2} kg CO2`, 14, 32);

    // tabla de actividades (si tiene)
    if (userReport.actividades?.length) {
      const rows = userReport.actividades.map(a => [
        a.id, a.tipo, a.cantidad, a.unidad, a.total_emision.toFixed(2), a.fecha
      ]);
      doc.autoTable({
        head: [["ID", "Tipo", "Cantidad", "Unidad", "Emisión (kg)", "Fecha"]],
        body: rows,
        startY: 42,
      });
    }
    doc.save(`reporte_usuario_${userReport.usuario.id}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Reportes</h2>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-3">Resumen de usuarios</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>ID</th><th>Usuario</th><th>Total (kg CO₂)</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {summary.map(u => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.id}</td>
                <td>{u.username}</td>
                <td>{u.total_emision_kgCO2}</td>
                <td>
                  <button onClick={()=>showDetail(u.id)} className="mr-2 text-blue-600">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Detalle: {detail.usuario.username}</h3>
            <div>
              <button onClick={()=>exportUserPdf(detail)} className="bg-blue-600 text-white px-3 py-1 rounded">Exportar PDF</button>
            </div>
          </div>

          <p>Total emisiones: <strong>{detail.total_emision_kgCO2} kg CO₂</strong></p>

          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th>ID</th><th>Tipo</th><th>Cantidad</th><th>Unidad</th><th>Emisión</th><th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {detail.actividades.map(a => (
                  <tr key={a.id} className="border-t">
                    <td className="py-2">{a.id}</td>
                    <td>{a.tipo}</td>
                    <td>{a.cantidad}</td>
                    <td>{a.unidad}</td>
                    <td>{a.total_emision}</td>
                    <td>{a.fecha}</td>
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

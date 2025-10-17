import DashboardLayout from "../layout/DashboardLayout";
import Card from "../components/Card";

export default function Dashboard() {
  const links = [
    { label: "Inicio" },
    { label: "Encuestas" },
    { label: "Recomendaciones" },
    { label: "Reportes" },
  ];

  return (
    <DashboardLayout links={links} user="Empleado">
  <h2 className="text-2xl font-bold text-[--color-verdeOscuro] mb-8 flex items-center gap-2">
    Bienvenido Empleado 🌿
  </h2>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <Card title="Transporte" desc="Registra tus medios de transporte." />
    <Card title="Alimentación" desc="Evalúa tu dieta y su impacto." />
    <Card title="Consumo Personal" desc="Revisa tus hábitos diarios." />
  </div>
</DashboardLayout>
  );
}

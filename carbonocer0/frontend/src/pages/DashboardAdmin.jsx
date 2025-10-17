import DashboardLayout from "../layout/DashboardLayout";
import Card from "../components/Card";

export default function DashboardAdmin() {
  const links = [
    { label: "Inicio" },
    { label: "Gestión de Usuarios" },
    { label: "Encuestas" },
    { label: "Recomendaciones" },
    { label: "Reportes" },
    { label: "Configuración" },
  ];

  return (
    <DashboardLayout links={links} user="Administrador">
      <h2 className="text-2xl font-bold text-[--color-verdeOscuro] mb-6">
        Bienvenido Administrador 👨‍💼
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Gestión de Usuarios" desc="Administra empleados y roles." />
        <Card title="Reportes" desc="Genera informes de huella." />
        <Card title="Dashboard" desc="Monitorea progreso institucional." />
      </div>
    </DashboardLayout>
  );
}

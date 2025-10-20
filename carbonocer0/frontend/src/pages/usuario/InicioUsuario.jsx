export default function InicioUsuario() {
    return(
        <div className="p-6 bg-white rounded-2xl shadow-md">
            <h1 className ="text-2xl font-semibold text-gray-800 mb-4">
                👋 Bienvenido al Panel de Usuario
            </h1>
            <p className="text-gray-600">
                Desde aquí puedes gestionar todas las secciones del sistema: Actividades,
                Recomendaciones, reportes y más.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#e6f4ea] border border-[#c3e6cb] rounded-lg shadow-sm">
                    <h3 className="font-semibold text-green-800">actividades</h3>
                    <p className="text-green-700">Registra las actividades que realizas</p>
                </div>

                <div className="p-4 bg-[#e6f0ff] border border-[#c3d6ff] rounded-lg shadow-sm">
                    <h3 className="font-semibold text-blue-800">Reportes</h3>
                    <p className="text-blue-700">Consulta el impacto total de CO₂ generado.</p>
                </div>
                <div className="p-4 bg-[#fff4e6] border border-[#ffe0b3] rounded-lg shadow-sm">
                    <h3 className="font-semibold text-orange-800">Recomendaciones</h3>
                    <p className="text-orange-700">Agrega consejos para reducir la huella de carbono.</p>
                </div>
            </div>
        </div>
    )
}
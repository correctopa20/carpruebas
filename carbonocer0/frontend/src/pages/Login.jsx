export default function Login() {
  const handleLogin = (role) => {
    localStorage.setItem("role", role);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-verdeOscuro text-white text-center">
      <h1 className="text-5xl font-display mb-8">🌱 Carbono Cer0</h1>
      <p className="text-lg mb-6 opacity-90">
        Ingresa según tu rol para comenzar.
      </p>
      <div className="space-x-6">
        <button
          onClick={() => handleLogin("admin")}
          className="bg-verdeClaro text-gris px-6 py-3 rounded-lg font-bold hover:bg-green-500 transition"
        >
          Ingresar como Admin
        </button>
        <button
          onClick={() => handleLogin("empleado")}
          className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Ingresar como Empleado
        </button>
      </div>
    </div>
  );
}

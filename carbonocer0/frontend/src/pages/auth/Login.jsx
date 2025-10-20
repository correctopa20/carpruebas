import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importar useNavigate
import { login, register } from "../../services/auth";

export default function Login() {
  const navigate = useNavigate(); // ✅ Hook de navegación
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isRegister) {
        await register(username, email, password);
        setSuccess("✅ Registro exitoso, ahora puedes iniciar sesión.");
        setIsRegister(false);
      } else {
        console.log('🔐 Attempting login...');
        const { role } = await login(email, password);
        console.log('✅ Login successful, role:', role);
        // ✅ Usar navigate en lugar de window.location.href
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      },100);
      }
    } catch (err) {
      console.error(err);
      setError(
        isRegister
          ? "❌ Error al registrarse. Intenta con otro correo."
          : "❌ Usuario o contraseña incorrectos."
      );
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-verdeOscuro text-white text-center">
      <h1 className="text-5xl font-display mb-8">🌱 Carbono Cer0</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-72 bg-white/10 p-6 rounded-xl shadow-lg"
      >
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 rounded text-black"
          />
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded text-black"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded text-black"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <button
          type="submit"
          className="bg-green-600 px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {isRegister ? "Registrarse" : "Ingresar"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="underline text-green-300 hover:text-green-100"
        >
          {isRegister ? "Inicia sesión" : "Regístrate aquí"}
        </button>
      </p>
    </div>
  );
}

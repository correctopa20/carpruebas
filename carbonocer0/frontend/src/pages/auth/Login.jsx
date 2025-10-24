// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        // 🔹 REGISTRO de nuevo usuario
        await register(username, email, password);
        console.log("✅ Registro exitoso");
        setError("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        setIsRegister(false); // Cambiar a login después del registro
        setUsername(""); // Limpiar campos
        setEmail("");
        setPassword("");
      } else {
        // 🔹 LOGIN de usuario existente
        const { role } = await login(email, password);
        console.log("✅ Login exitoso con rol:", role);

        // 🔄 Redirigir según el rol
        if (role === "admin") {
          navigate("/admin/inicio", { replace: true });
        } else if (role === "user" || role === "empleado") {
          navigate("/usuario/inicio", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[--color-arena]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
        </h1>

        {error && (
          <p className={`p-2 rounded-md mb-4 ${
            error.includes("✅") 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Nombre de usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Ingresa tu nombre completo"
                minLength={2}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:border-green-500 focus:outline-none transition-colors"
              placeholder={isRegister ? "Mínimo 6 caracteres" : "Ingresa tu contraseña"}
              minLength={isRegister ? 6 : 1}
            />
            {isRegister && (
              <p className="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 6 caracteres</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
          >
            {loading 
              ? (isRegister ? "Creando cuenta..." : "Entrando...") 
              : (isRegister ? "Crear cuenta" : "Iniciar sesión")
            }
          </button>
        </form>

        <div className="text-center border-t pt-4">
          <button
            type="button"
            onClick={toggleMode}
            className="text-green-600 hover:text-green-800 font-medium transition-colors"
          >
            {isRegister 
              ? "¿Ya tienes cuenta? Inicia sesión" 
              : "¿No tienes cuenta? Regístrate aquí"
            }
          </button>
        </div>

        {isRegister && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              📝 <strong>Información importante:</strong> Al registrarte se creará una cuenta con rol de <strong>empleado</strong> por defecto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
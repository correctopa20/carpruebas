import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await API.post("/login", { username, password });
    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("is_admin", res.data.is_admin);
    window.location.href = res.data.is_admin ? "/admin" : "/empleado";
  };

  return (
    <div className="flex flex-col items-center mt-40">
      <h2 className="text-xl mb-4">Iniciar Sesión</h2>
      <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

// src/services/auth.js
export async function login(email, password) {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) localStorage.setItem("token", data.access_token);
  return data;
}

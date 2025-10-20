// src/pages/Admin/AdminEmployees.jsx
import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";
import { toast } from "react-toastify"; // opcional si usas toast

export default function EmpleadosAdmin() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const load = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateEmployee(editing.id, {
          username: form.username,
          email: form.email,
          password: form.password || undefined
        });
        // toast.success("Empleado actualizado");
      } else {
        await createEmployee(form);
        // toast.success("Empleado creado");
      }
      setForm({ username: "", email: "", password: "" });
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm({ username: emp.username, email: emp.email, password: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar empleado?")) return;
    try {
      await deleteEmployee(id);
      load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Empleados</h2>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="p-2 border rounded" placeholder="Nombre" value={form.username}
            onChange={(e)=>setForm({...form, username:e.target.value})} required />
          <input className="p-2 border rounded" placeholder="Correo" value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})} required type="email" />
          <input className="p-2 border rounded" placeholder="Contraseña (si crea/actualiza)" value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})} type="password" />
          <div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {editing ? "Actualizar" : "Crear"}
            </button>
            {editing && <button type="button" className="ml-3 px-3 py-2" onClick={()=>{setEditing(null); setForm({username:"",email:"",password:""})}}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2">ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Activo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id} className="border-t">
                <td className="py-2">{e.id}</td>
                <td>{e.username}</td>
                <td>{e.email}</td>
                <td>{String(e.is_active)}</td>
                <td>
                  <button onClick={()=>handleEdit(e)} className="mr-2 text-blue-600">Editar</button>
                  <button onClick={()=>handleDelete(e.id)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import API from "../services/api";

export default function DashboardAdmin() {
  const [data, setData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get("/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setData(res.data.message))
      .catch(() => (window.location.href = "/"));
  }, []);

  return <h1>{data}</h1>;
}

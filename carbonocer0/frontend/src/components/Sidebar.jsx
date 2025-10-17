import { useNavigate } from "react-router-dom";

export default function Sidebar({ links, user }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="bg-[--color-verdeOscuro] text-white w-64 min-h-screen flex flex-col justify-between shadow-lg">
  <ul className="p-4 space-y-2">
    {links.map((l) => (
      <li
        key={l.label}
        className="px-3 py-2 rounded hover:bg-[--color-verdeClaro] hover:text-[--color-verdeOscuro] transition cursor-pointer"
      >
        {l.label}
      </li>
    ))}
  </ul>
</aside>

  );
}

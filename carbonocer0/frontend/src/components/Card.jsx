export default function Card({ title, desc }) {
  return (
    <div className="bg-white border border-[--color-verdeClaro]/40 p-6 rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
      <h3 className="text-lg font-bold text-[--color-verdeOscuro] mb-2 flex items-center gap-2">
        <span className="text-[--color-verdeClaro]">●</span> {title}
      </h3>
      <p className="text-sm text-[--color-gris]/80">{desc}</p>
    </div>
  );
}

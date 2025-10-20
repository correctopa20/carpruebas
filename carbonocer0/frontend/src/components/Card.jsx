// src/components/Card.jsx
import { motion } from "framer-motion";

export default function Card({ title, desc, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/80 backdrop-blur-md border border-[--color-verdeClaro]/30 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="text-[--color-verdeMedio] w-5 h-5" />}
        <h3 className="text-lg font-bold text-[--color-verdeOscuro]">{title}</h3>
      </div>
      <p className="text-sm text-[--color-gris]/70">{desc}</p>
    </motion.div>
  );
}

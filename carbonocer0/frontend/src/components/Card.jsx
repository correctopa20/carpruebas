import { motion } from "framer-motion";

export default function Card({ 
  title, 
  value, 
  description, 
  color = "default",
  icon: Icon,
  trend,
  trendValue 
}) {
  const colorClasses = {
    default: "bg-white/80 border-[--color-verdeClaro]/30",
    blue: "bg-blue-50/80 border-blue-200",
    green: "bg-green-50/80 border-green-200", 
    red: "bg-red-50/80 border-red-200",
    purple: "bg-purple-50/80 border-purple-200",
    orange: "bg-orange-50/80 border-orange-200"
  };

  const iconColors = {
    default: "text-[--color-verdeMedio]",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600", 
    purple: "text-purple-600",
    orange: "text-orange-600"
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  const trendIcons = {
    up: "↗",
    down: "↘", 
    neutral: "→"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${colorClasses[color]} backdrop-blur-md border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-lg ${colorClasses[color].replace('/80', '/20')}`}>
              <Icon className={`${iconColors[color]} w-5 h-5`} />
            </div>
          )}
          <h3 className="text-lg font-bold text-[--color-verdeOscuro]">{title}</h3>
        </div>
        
        {trend && (
          <div className={`text-sm font-semibold ${trendColors[trend]}`}>
            <span className="mr-1">{trendIcons[trend]}</span>
            {trendValue}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
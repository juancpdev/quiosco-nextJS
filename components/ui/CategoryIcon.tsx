"use client"

import { iconMap } from "@/src/utils/category-icons"
import { Category } from "@prisma/client"
import Link from "next/link"
import { useParams } from "next/navigation"

type CategoryIconProps = {
  category: Category
}

export default function CategoryIcon({ category }: CategoryIconProps) {
  const params = useParams<{ category: string }>()
  
  // Ícono dinámico con fallback
  const Icon = iconMap[category.icon] || iconMap.Utensils
  const isActive = params.category === category.slug

  return (
    <Link
      href={`/order/${category.slug}`}
      className={`
        group relative flex items-center gap-4 w-full
        rounded-xl p-4 transition-all duration-200
        ${isActive
          ? "bg-linear-to-r from-orange-400 to-orange-500 text-white shadow-lg scale-[1.02]"
          : "bg-white hover:bg-orange-50 text-gray-700 hover:shadow-md hover:scale-[1.01]"
        }
      `}
    >
      {/* Indicador activo (barra lateral izquierda) */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-white rounded-r-full" />
      )}

      {/* Contenedor del ícono */}
      <div
        className={`
          shrink-0 w-14 h-14 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${isActive
            ? "bg-white/20"
            : "bg-orange-100 group-hover:bg-orange-200"
          }
        `}
      >
        <Icon
          className={`w-7 h-7 ${isActive ? "text-white" : "text-orange-600"}`}
          strokeWidth={2.5}
        />
      </div>

      {/* Texto de categoría */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            font-bold text-lg leading-tight line-clamp-2
            ${isActive ? "text-white" : "text-gray-800 group-hover:text-orange-600"}
          `}
        >
          {category.name}
        </p>
        {!isActive && (
          <p className="text-xs text-gray-500 group-hover:text-orange-500 transition-colors">
            Ver productos
          </p>
        )}
      </div>

      {/* Flecha indicadora (solo visible cuando no está activo) */}
      {!isActive && (
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-all group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  )
}
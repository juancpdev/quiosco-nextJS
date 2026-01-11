"use client"

import { iconMap, iconsByGroup } from "@/src/utils/category-icons"
import { Category } from "@prisma/client"
import { useState } from "react"

type CategoryFormProps = {
  category?: Category
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || "")

  // Orden de los grupos
  const groupOrder = ["Comidas", "Bebidas", "Postres", "Saludable", "General", "Sin Icono"]

  return (
    <>
      {/* Campo Nombre */}
      <div className="space-y-2">
        <label
          className="text-slate-800 font-semibold"
          htmlFor="name"
        >
          Nombre:
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className="block w-full p-3 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Ej: Hamburguesas, Pizzas, Café..."
          defaultValue={category?.name}
        />
      </div>

      {/* Selector de Icono */}
      <div className="space-y-3">
        <label className="text-slate-800 font-semibold">
          Ícono de la Categoría:
        </label>


        {/* Iconos agrupados por categoría */}
        <div className="max-h-[500px] overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
          {groupOrder.map(groupName => {
            const icons = iconsByGroup[groupName]
            if (!icons) return null

            return (
              <div key={groupName}>
                {/* Título del grupo */}
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">
                    {groupName === "Sin icono" && ""}
                    {groupName === "Comidas" && "🍔"}
                    {groupName === "Bebidas" && "☕"}
                    {groupName === "Postres" && "🍰"}
                    {groupName === "Saludable" && "🍎"}
                    {groupName === "General" && "🍴"}
                  </span>
                  {groupName}
                </h3>

                {/* Grid de iconos del grupo */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {icons.map(({ name, label }) => {
                    const Icon = iconMap[name]
                    const isSelected = selectedIcon === name

                    return (
                      <button
                        type="button"
                        key={name}
                        onClick={() => setSelectedIcon(name)}
                        className={`
                          flex flex-col items-center gap-1.5 p-2.5 rounded-lg
                          transition-all duration-200 cursor-pointer
                          hover:scale-105 active:scale-95
                          ${isSelected
                            ? 'bg-orange-500 shadow-lg scale-105'
                            : 'bg-white hover:bg-orange-50 shadow'
                          }
                        `}
                        title={label}
                      >
                        <Icon 
                          className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-orange-600'}`}
                          strokeWidth={2}
                        />
                        <span className={`text-[10px] font-medium text-center leading-tight ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                          {label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Campo hidden para enviar el icono */}
        <input type="hidden" name="icon" value={selectedIcon} />
      </div>
    </>
  )
}
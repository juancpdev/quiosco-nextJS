"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Logo from "../ui/Logo"
import AdminButton from "../ui/AdminButton"
import CategorySlider from "./CategorySlider"
import { useScrollBlock } from "../ui/scrollBlock"

export default function OrderSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  useScrollBlock(isOpen);
  return (
    <>
      {/* Botón hamburguesa (solo móvil) */}
      {!isOpen && (
        <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden fixed top-4 left-4 z-50 bg-orange-500 text-white p-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all"
              aria-label="Abrir menú de categorías"
            >
              <Menu size={24} />
        </button>
      )}

      {/* Overlay oscuro (solo móvil cuando está abierto) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="xl:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed xl:sticky top-0 left-0 h-screen bg-white z-40
          xl:w-72 w-80 max-w-[85vw]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
          shadow-xl xl:shadow-none
          flex flex-col
        `}
      >
        {/* Header del sidebar (solo móvil) */}
        <div className="xl:hidden flex items-center justify-between p-5 border-b border-gray-200 bg-linear-to-r from-orange-50 to-orange-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Categorías</h2>
            <p className="text-sm text-gray-600">Seleccioná tu categoría</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Título para desktop */}
        <div className="hidden xl:block p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Categorías</h2>
        </div>

        {/* Slider de categorías */}
        <div className="flex-1 overflow-hidden">
          <CategorySlider onCategoryClick={() => setIsOpen(false)} />
        </div>

        {/* Footer del sidebar */}
        <div className="p-5 border-t border-gray-200 space-y-4">
          {/* Botón Admin */}
          <AdminButton />
          
          {/* Logo */}
          <div className="flex items-center justify-center pt-2">
            <Logo />
          </div>
        </div>
      </aside>
    </>
  )
}
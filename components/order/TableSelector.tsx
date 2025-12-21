'use client'

import { useState, useEffect } from 'react'
import { getAllTables } from '@/actions/table-actions'
import { Table } from '@prisma/client'
import { Store } from 'lucide-react'

type TableSelectorProps = {
  value: number | undefined
  onChange: (tableNumber: number) => void
  error?: string
}

export default function TableSelector({ value, onChange, error }: TableSelectorProps) {
  const [tables, setTables] = useState<Table[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTables = async () => {
      setIsLoading(true)
      const allTables = await getAllTables()
      setTables(allTables)
      setIsLoading(false)
    }
    loadTables()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (tables.length === 0) {
    return (
      <div className="w-full p-4 bg-gray-100 rounded-lg text-center text-gray-500 text-sm">
        No hay mesas disponibles. Contacta al administrador.
      </div>
    )
  }

  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-2 text-sm">
        Selecciona tu mesa
      </label>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-6 gap-2">
        {tables.map((table) => {
          const isSelected = value === table.number
          const isOccupied = table.status === 'occupied'

          return (
            <button
              key={table.id}
              type="button"
              onClick={() => onChange(table.number)}
              className={`
                relative cursor-pointer aspect-square rounded-lg p-2 flex flex-col items-center justify-center
                transition-all duration-200 font-bold text-sm
                ${isSelected
                  ? 'bg-orange-500 text-white ring-2 ring-orange-300 scale-105'
                  : isOccupied
                    ? 'bg-red-200 text-red-700 border-2 border-red-300 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                }
              `}
            >
              <Store size={14} className="mb-0.5" />
              <span>{table.number}</span>
              
              {/* Badge de estado */}
              {isOccupied && !isSelected && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          )
        })}
      </div>
      
      {/* Leyenda */}
      <div className="flex gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-green-500 border border-green-300 rounded"></div>
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 border border-red-300 rounded"></div>
          <span className="text-gray-600">En uso</span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
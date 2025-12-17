'use client'

import { useEffect, useState } from 'react'
import { getAllTables } from '@/actions/table-actions'
import { Table } from '@prisma/client'
import { CheckCircle2, XCircle } from 'lucide-react'

type TableSelectorProps = {
  value: number | undefined
  onChange: (tableNumber: number) => void
  error?: string
}

export default function TableSelector({ value, onChange, error }: TableSelectorProps) {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTables()
  }, [])

  const loadTables = async () => {
    const allTables = await getAllTables()
    setTables(allTables)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="py-4">
        <p className="text-gray-500">Cargando mesas...</p>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Selecciona tu mesa
      </label>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {tables.map(table => {
          const isAvailable = table.status === 'available'
          const isSelected = value === table.number

          return (
            <button
              key={table.id}
              type="button"
              onClick={() => onChange(table.number)} // ✅ SIEMPRE se puede seleccionar
              className={`
                relative aspect-square rounded-xl p-3 transition-all duration-200
                flex flex-col items-center justify-center gap-1
                ${isSelected 
                  ? 'bg-orange-500 text-white ring-4 ring-orange-200 scale-105'
                  : isAvailable
                    ? 'bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200 hover:scale-105'
                    : 'bg-red-50 hover:bg-red-100 text-red-500 border-2 border-red-200'
                }
              `}
            >
              <span className="text-xl font-bold">
                {table.number}
              </span>
              
              {isAvailable ? (
                <CheckCircle2 size={16} className={isSelected ? 'text-white' : 'text-green-500'} />
              ) : (
                <XCircle size={16} className="text-red-500" />
              )}
              
              <span className="text-xs mt-1">
                {isAvailable ? 'Libre' : 'Ocupada'}
              </span>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {value && (
        <p className="mt-3 text-sm text-gray-600">
          Mesa seleccionada:{' '}
          <strong className="text-orange-600">Mesa {value}</strong>
        </p>
      )}
    </div>
  )
}

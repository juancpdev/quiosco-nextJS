'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { createTables, deleteTable } from '@/actions/table-actions'
import { useRouter } from 'next/navigation'

type TableManagementProps = {
  existingTables: number[]
}

export default function TableManagement({ existingTables }: TableManagementProps) {
  const [numberOfTables, setNumberOfTables] = useState(10)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateTables = async () => {
    if (numberOfTables < 1 || numberOfTables > 50) {
      toast.error('El número de mesas debe estar entre 1 y 50')
      return
    }

    setLoading(true)
    const result = await createTables(numberOfTables)
    
    if (result.success) {
      toast.success(`${numberOfTables} mesas creadas exitosamente`)
      router.refresh()
    } else {
      toast.error('Error al crear las mesas')
    }
    setLoading(false)
  }

  const handleDeleteTable = async (tableNumber: number) => {
    const confirmed = window.confirm(`¿Eliminar Mesa ${tableNumber}?`)
    if (!confirmed) return

    const result = await deleteTable(tableNumber)
    
    if (result.success) {
      toast.success(`Mesa ${tableNumber} eliminada`)
      router.refresh()
    } else {
      toast.error(result.error || 'Error al eliminar la mesa')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Configuración de Mesas</h3>
      
      <div className="flex gap-4 items-end mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de mesas a crear
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={numberOfTables}
            onChange={(e) => setNumberOfTables(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleCreateTables}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          {loading ? 'Creando...' : 'Crear Mesas'}
        </button>
      </div>

      {existingTables.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Mesas Existentes ({existingTables.length})</h4>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {existingTables.map(tableNum => (
              <div
                key={tableNum}
                className="relative bg-gray-100 rounded-lg p-2 text-center group"
              >
                <span className="font-semibold text-gray-700">{tableNum}</span>
                <button
                  onClick={() => handleDeleteTable(tableNum)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
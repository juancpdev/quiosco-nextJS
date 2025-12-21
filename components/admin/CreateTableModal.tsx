'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { createTables } from '@/actions/table-actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

type CreateTableModalProps = {
  onClose: () => void
}

export default function CreateTableModal({ onClose }: CreateTableModalProps) {
  const [count, setCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (count < 1 || count > 50) {
      toast.error('Debe crear entre 1 y 50 mesas')
      return
    }

    setIsLoading(true)
    const result = await createTables(count)

    if (result.success) {
      toast.success(`${count} ${count === 1 ? 'mesa creada' : 'mesas creadas'} exitosamente`)
      router.refresh()
      onClose()
    } else {
      toast.error('Error al crear las mesas')
    }
    setIsLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[90%] max-w-md shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3">
            <Plus size={32} />
            <div>
              <h2 className="text-2xl font-bold">Crear Mesas</h2>
              <p className="text-green-100 text-sm">
                Agrega nuevas mesas al sistema
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ¿Cuántas mesas deseas crear?
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-lg font-semibold text-center"
              placeholder="Cantidad"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Se crearán rellenando los números faltantes. Por ejemplo, si tienes mesas 1, 2, 5, 6 y creas 5 mesas, se crearán las 3, 4, 7, 8, 9.
            </p>
          </div>

          {/* Previsualización */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Vista previa:
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(count, 10) }, (_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center font-bold shadow-md"
                >
                  +
                </div>
              ))}
              {count > 10 && (
                <div className="w-12 h-12 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center font-bold">
                  +{count - 10}
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || count < 1}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Crear {count} {count === 1 ? 'Mesa' : 'Mesas'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
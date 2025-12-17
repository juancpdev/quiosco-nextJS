'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TableWithOrders } from '@/src/types'
import { formatCurrency } from '@/src/utils'
import { X, Store, Phone, User, Clock, DollarSign } from 'lucide-react'
import Image from 'next/image'
import { closeTable } from '@/actions/table-actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

type TableSummaryModalProps = {
  table: TableWithOrders
  onClose: () => void
}

export default function TableSummaryModal({ table, onClose }: TableSummaryModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const totalAmount = table.orders.reduce((sum, order) => sum + order.total, 0)
  const firstOrder = table.orders[0]

  const handleCloseTable = async () => {
    if (!confirm(`¿Cerrar la Mesa ${table.number}? Esto marcará todas las órdenes como completadas.`)) {
      return
    }

    setIsLoading(true)
    const result = await closeTable(table.id)

    if (result.success) {
      toast.success(`Mesa ${table.number} cerrada exitosamente`)
      router.refresh()
      onClose()
    } else {
      toast.error('Error al cerrar la mesa')
    }
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl w-[95%] max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-3xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3">
              <Store size={32} />
              <div>
                <h2 className="text-3xl font-bold">Mesa {table.number}</h2>
                <p className="text-orange-100 text-sm">
                  {table.orders.length} {table.orders.length === 1 ? 'orden activa' : 'órdenes activas'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="font-semibold">{firstOrder?.name || 'N/A'}</p>
                </div>
              </div>
              {firstOrder?.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="font-semibold">{firstOrder.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Órdenes de la sesión</h3>
            
            {table.orders.map((order, index) => (
              <div key={order.id} className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full text-sm">
                      Orden #{order.id}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={14} />
                      {new Date(order.date).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
                </div>

                {/* Products */}
                <div className="space-y-2">
                  {order.orderProducts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <Image
                          src={`/products/${item.product.image}.jpg`}
                          alt={item.product.name}
                          width={50}
                          height={50}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.product.price)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs font-semibold text-yellow-800">Nota:</p>
                    <p className="text-sm text-yellow-900">{order.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer - Total & Actions */}
          <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl border-t-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign size={24} className="text-gray-600" />
                <span className="text-lg font-semibold text-gray-600">Total General:</span>
              </div>
              <span className="text-3xl font-bold text-orange-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseTable}
                disabled={isLoading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Cerrar Mesa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
'use client'

import { useState } from 'react'
import { TableWithOrders } from '@/src/types'
import { formatCurrency } from '@/src/utils'
import { Store, Users, DollarSign } from 'lucide-react'
import TableSummaryModal from './TableSummaryModal'

type TableGridProps = {
  tables: TableWithOrders[]
}

export default function TableGrid({ tables }: TableGridProps) {
  const [selectedTable, setSelectedTable] = useState<TableWithOrders | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Crear grid de 10 mesas (puedes ajustar el número)
  const allTables = Array.from({ length: 10 }, (_, i) => {
    const tableNumber = i + 1
    const table = tables.find(t => t.number === tableNumber)
    return table || { number: tableNumber, status: 'available', orders: [] }
  })

  const handleTableClick = (table: any) => {
    if (table.status === 'occupied') {
      setSelectedTable(table)
      setShowModal(true)
    }
  }

  const getTotalForTable = (table: any) => {
    if (!table.orders || table.orders.length === 0) return 0
    return table.orders.reduce((sum: number, order: any) => sum + order.total, 0)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {allTables.map((table) => {
          const isOccupied = table.status === 'occupied'
          const total = getTotalForTable(table)
          const orderCount = table.orders?.length || 0

          return (
            <div
              key={table.number}
              onClick={() => handleTableClick(table)}
              className={`
                relative aspect-square rounded-2xl p-4 shadow-lg transition-all duration-300
                ${isOccupied 
                  ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white cursor-pointer hover:scale-105 hover:shadow-xl' 
                  : 'bg-white border-2 border-gray-200 text-gray-400'
                }
              `}
            >
              {/* Número de mesa */}
              <div className="absolute top-3 left-3">
                <Store size={24} className={isOccupied ? 'text-white' : 'text-gray-300'} />
              </div>
              
              <div className="h-full flex flex-col items-center justify-center space-y-2">
                <p className={`text-3xl font-bold ${isOccupied ? 'text-white' : 'text-gray-400'}`}>
                  {table.number}
                </p>
                
                {isOccupied && (
                  <>
                    <div className="flex items-center gap-1 text-sm">
                      <Users size={14} />
                      <span>{orderCount} {orderCount === 1 ? 'orden' : 'órdenes'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <DollarSign size={14} />
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </>
                )}
                
                {!isOccupied && (
                  <p className="text-xs text-gray-400">Disponible</p>
                )}
              </div>

              {/* Indicador de estado */}
              {isOccupied && (
                <div className="absolute bottom-3 right-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal de resumen */}
      {showModal && selectedTable && (
        <TableSummaryModal
          table={selectedTable}
          onClose={() => {
            setShowModal(false)
            setSelectedTable(null)
          }}
        />
      )}
    </>
  )
}
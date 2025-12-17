'use client'

import { useState, useRef, useEffect } from 'react'
import { Table } from '@prisma/client'
import { updateTablePosition, closeTable } from '@/actions/table-actions'
import { Store, DollarSign, Clock, Move, X, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/src/utils'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

type OrderProduct = {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}

type Order = {
  id: number
  name: string
  phone: string
  total: number
  status: string
  date: Date
  orderProducts: OrderProduct[]
}

type TableWithOrders = Table & {
  orders: Order[]
}

type TableCanvasProps = {
  tables: Table[]
  occupiedTables: TableWithOrders[]
}

type DraggingTable = {
  id: number
  number: number
  offsetX: number
  offsetY: number
}

export default function TableCanvas({ tables, occupiedTables }: TableCanvasProps) {
  const [editMode, setEditMode] = useState(false)
  const [draggingTable, setDraggingTable] = useState<DraggingTable | null>(null)
  const [tablePositions, setTablePositions] = useState<Map<number, { x: number; y: number }>>(new Map())
  const [selectedTable, setSelectedTable] = useState<TableWithOrders | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const positions = new Map()
    tables.forEach(table => {
      positions.set(table.id, { x: table.positionX, y: table.positionY })
    })
    setTablePositions(positions)
  }, [tables])

  // Listener global para capturar mouseup en cualquier parte
  useEffect(() => {
    const handleGlobalMouseUp = async () => {
      if (!draggingTable) return

      const position = tablePositions.get(draggingTable.id)
      if (position) {
        // Primero limpiamos el estado de dragging INMEDIATAMENTE
        const tableId = draggingTable.id
        const pos = { ...position }
        setDraggingTable(null)
        
        // Luego guardamos en background sin bloquear
        updateTablePosition(tableId, pos.x, pos.y).catch(err => {
          console.error('Error updating table position:', err)
        })
      } else {
        setDraggingTable(null)
      }
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [draggingTable, tablePositions])

  const getTableInfo = (tableNumber: number): TableWithOrders | null => {
    return occupiedTables.find(t => t.number === tableNumber) || null
  }

  const handleMouseDown = (e: React.MouseEvent, table: Table) => {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const pos = tablePositions.get(table.id) || { x: table.positionX, y: table.positionY }
    
    setDraggingTable({
      id: table.id,
      number: table.number,
      offsetX: e.clientX - rect.left - pos.x,
      offsetY: e.clientY - rect.top - pos.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTable || !canvasRef.current || !editMode) return
    
    e.preventDefault()
    e.stopPropagation()

    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left - draggingTable.offsetX, rect.width - 80))
    const y = Math.max(0, Math.min(e.clientY - rect.top - draggingTable.offsetY, rect.height - 80))

    setTablePositions(prev => {
      const newPositions = new Map(prev)
      newPositions.set(draggingTable.id, { x, y })
      return newPositions
    })
  }

  const handleTableClick = (table: Table) => {
    if (editMode || draggingTable) return
    
    const tableInfo = getTableInfo(table.number)
    if (tableInfo) {
      setSelectedTable(tableInfo)
    }
  }

  const handleCloseTable = async () => {
    if (!selectedTable) return

    const confirmed = window.confirm(`¿Cerrar Mesa ${selectedTable.number}? Esto marcará todas las órdenes como completadas.`)
    if (!confirmed) return

    const result = await closeTable(selectedTable.id)
    
    if (result.success) {
      toast.success(`Mesa ${selectedTable.number} cerrada exitosamente`)
      setSelectedTable(null)
      router.refresh()
    } else {
      toast.error('Error al cerrar la mesa')
    }
  }

  return (
    <div className="relative">
      {/* Botón de modo edición */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => {
            setEditMode(!editMode)
            setSelectedTable(null)
          }}
          className={`
            px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all
            ${editMode 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }
          `}
        >
          <Move size={20} />
          {editMode ? 'Finalizar Edición' : 'Reorganizar Mesas'}
        </button>

        {editMode && (
          <p className="text-sm text-orange-600 font-medium">
            Arrastra las mesas para reorganizarlas
          </p>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`relative bg-gray-50 border-2 border-gray-300 rounded-xl overflow-hidden ${editMode ? 'cursor-move' : 'cursor-default'}`}
        style={{ 
          width: '100%', 
          height: '600px',
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Mesas */}
        {tables.map(table => {
          const position = tablePositions.get(table.id) || { x: table.positionX, y: table.positionY }
          const isOccupied = table.status === 'occupied'
          const tableInfo = getTableInfo(table.number)

          return (
            <div
              key={table.id}
              className={`absolute transition-shadow duration-200 ${editMode ? 'cursor-move' : 'cursor-pointer'}`}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '80px',
                height: '80px'
              }}
              onMouseDown={(e) => handleMouseDown(e, table)}
              onClick={() => handleTableClick(table)}
            >
              <div
                className={`
                  w-full h-full rounded-xl shadow-lg flex flex-col items-center justify-center
                  transition-all duration-200
                  ${draggingTable?.id === table.id 
                    ? 'bg-yellow-400 text-gray-900 scale-110 shadow-2xl' 
                    : isOccupied 
                      ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105' 
                      : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                  }
                `}
              >
                <Store size={20} className="mb-1" />
                <span className="font-bold text-lg">{table.number}</span>
                {isOccupied && tableInfo && (
                  <span className={`text-xs mt-1 font-semibold ${draggingTable?.id === table.id ? 'text-gray-900' : ''}`}>
                    ${tableInfo.orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Store size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay mesas creadas</p>
              <p className="text-xs">Crea mesas en la sección de arriba</p>
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Ocupada</span>
          </div>
        </div>
      </div>

      {/* Modal de detalles de mesa */}
      {selectedTable && !editMode && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Mesa {selectedTable.number}</h2>
                  <p className="text-orange-100">
                    {selectedTable.orders[0]?.name || 'Cliente'} • {selectedTable.orders[0]?.phone || 'Sin teléfono'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                >
                  <X size={24} className='text-black cursor-pointer' />
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Clock size={20} />
                    <span className="text-sm font-semibold">Total de Pedidos</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{selectedTable.orders.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <DollarSign size={20} />
                    <span className="text-sm font-semibold">Total a Pagar</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(selectedTable.orders.reduce((sum, order) => sum + order.total, 0))}
                  </p>
                </div>
              </div>
            </div>

            {/* Órdenes */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Detalles de Pedidos</h3>
              <div className="space-y-4">
                {selectedTable.orders.map((order, idx) => (
                  <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-700">Pedido #{idx + 1}</h4>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : ''}
                        ${order.status === 'ready' ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        {order.status === 'pending' && 'Pendiente'}
                        {order.status === 'preparing' && 'Preparando'}
                        {order.status === 'ready' && 'Listo'}
                      </span>
                    </div>

                    {/* Productos */}
                    <div className="space-y-2">
                      {order.orderProducts.map(op => (
                        <div key={op.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {op.quantity}x {op.product.name}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(op.product.price * op.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer con acciones */}
            <div className="p-6 bg-gray-50 rounded-b-2xl border-t">
              <button
                onClick={handleCloseTable}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle size={20} />
                Cerrar Mesa y Completar Pedidos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
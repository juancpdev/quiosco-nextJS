'use client'

import { useState, useRef, useEffect } from 'react'
import { Table } from '@prisma/client'
import { updateTablePosition } from '@/actions/table-actions'
import { Store, Move, X, Plus } from 'lucide-react'
import { TableWithOrders } from '@/src/types'
import TableSummaryModal from './TableSummaryModal'
import EditTableModal from './EditTableModal'
import CreateTableModal from './CreateTableModal'
import { formatCurrency } from '@/src/utils'

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
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [editTable, setEditTable] = useState<Table | null>(null)
  const [createTable, setCreateTable] = useState<true | false>(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleCloseModal = () => {
    setEditTable(null)
    setSelectedTableId(null)
  }

  const handleUpdateSuccess = () => {
    // Aquí podés refrescar mesas desde el server o estado
    setEditTable(null)
    setSelectedTableId(null)
  }

  useEffect(() => {
    const positions = new Map()
    tables.forEach(table => {
      positions.set(table.id, { x: table.positionX, y: table.positionY })
    })
    setTablePositions(positions)
  }, [tables])

  useEffect(() => {
    const handleGlobalMouseUp = async () => {
      if (!draggingTable) return

      const position = tablePositions.get(draggingTable.id)
      if (position) {
        const tableId = draggingTable.id
        const pos = { ...position }
        setDraggingTable(null)
        
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
    isDraggingRef.current = false
    if (!editMode) return

    dragStartRef.current = { x: e.clientX, y: e.clientY }
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

    const start = dragStartRef.current
    if (!start) return

    const dx = Math.abs(e.clientX - start.x)
    const dy = Math.abs(e.clientY - start.y)
    const DRAG_THRESHOLD = 5

    if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return // sigue siendo click

    isDraggingRef.current = true
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
    if (isDraggingRef.current) return
    
    if (editMode) {
      setEditTable(table)
      setSelectedTableId(table.id)
      return
    }
    
    const tableInfo = getTableInfo(table.number)
    if (tableInfo) {
      setSelectedTable(tableInfo)
    }
  }

  const addTable = () => {
    setCreateTable(true)
  }

  return (
    <div className="relative">
      {/* Botón de modo edición */}
      <div className="mb-4 flex justify-between items-center">
        <div className='flex gap-5'>
          <button
            onClick={() => {
              setEditMode(!editMode)
              setSelectedTable(null)
            }}
            className={`px-4 py-2 cursor-pointer rounded-lg font-semibold flex items-center gap-2 transition-all
              ${editMode 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            <Move size={20} />
            {editMode ? 'Finalizar Edición' : 'Configurar Mesas'}
          </button>

          {editMode && (
            <button
            onClick={() => {
              addTable()
            }}
            className={`px-4 py-2 cursor-pointer rounded-lg font-semibold flex items-center gap-2 transition-all
              ${editMode 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            <Plus size={20} />
            Agregar mesa
          </button>
          )}
        </div>

        {editMode && (
          <p className="text-sm text-orange-600 font-medium">
            Arrastra las mesas para reorganizarlas
          </p>
        )}
      </div>

      {/* Modal de edición */}
      {editTable && (
        <EditTableModal
          table={editTable}
          onClose={handleCloseModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Modal de creacion */}
      {createTable && (
        <CreateTableModal
          onClose={() => setCreateTable(false)} // ✅ Agregar onClose
        />
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`relative bg-gray-50 border-2 border-gray-300 rounded-xl overflow-hidden ${editMode ? 'cursor-move' : 'cursor-default'}`}
        style={{ width: '100%', height: '600px', backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        onMouseMove={handleMouseMove}
      >
        {tables.map(table => {
          const position = tablePositions.get(table.id) || { x: table.positionX, y: table.positionY }
          const isOccupied = table.status === 'occupied'
          const tableInfo = getTableInfo(table.number)
          const isSelected = selectedTableId === table.id 
          return (
            <div
              key={table.id}
              className={`absolute transition-shadow duration-200 cursor-pointer`}
              style={{ left: `${position.x}px`, top: `${position.y}px`, width: '80px', height: '80px' }}
              onMouseDown={(e) => handleMouseDown(e, table)}
              onClick={() => handleTableClick(table)}
            >
              <div
                className={`w-full h-full rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-200
                  ${editMode 
                    ?  isSelected
                        ? 'bg-gray-400 text-white ring-4 ring-yellow-300 scale-110'
                        : 'bg-gray-400 text-white' 
                    : draggingTable?.id === table.id 
                    ? 'bg-yellow-400 text-gray-900 scale-110 shadow-2xl' 
                    : isOccupied 
                      ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105' 
                      : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                  }`}
              >
                <Store size={20} className="mb-1" />
                <span className="font-bold text-lg">{table.number}</span>
                {isOccupied && tableInfo && (
                  <span className="text-xs mt-1 font-semibold">
                    {formatCurrency(tableInfo.orders.reduce((sum, order) => sum + order.total, 0))}
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

      {/* Modal de resumen */}
      {selectedTable && !editMode && (
        <TableSummaryModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
        />
      )}
    </div>
  )
}

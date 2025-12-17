import TableCanvas from "@/components/admin/TableCanvas";
import TableManagement from "@/components/admin/TableManagement";
import Heading from "@/components/ui/Heading";
import { getTablesWithOrders, getAllTables } from "@/actions/table-actions";

export const dynamic = 'force-dynamic'

export default async function TablesPage() {
  const occupiedTables = await getTablesWithOrders()
  const allTables = await getAllTables()

  const totalRevenue = occupiedTables.reduce((sum, table) => {
    return sum + table.orders.reduce((orderSum, order) => orderSum + order.total, 0)
  }, 0)

  const existingTableNumbers = allTables.map(t => t.number).sort((a, b) => a - b)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Heading>Gestión de Mesas</Heading>
      
      {/* Componente de configuración */}
      <TableManagement existingTables={existingTableNumbers} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <p className="text-gray-500 text-sm font-semibold">Mesas Totales</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{allTables.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <p className="text-gray-500 text-sm font-semibold">Mesas Ocupadas</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">{occupiedTables.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
          <p className="text-gray-500 text-sm font-semibold">Total en Mesas</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Canvas de Mesas */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Plano de Mesas</h3>
        <TableCanvas 
          tables={allTables} 
          occupiedTables={occupiedTables}
        />
      </div>
    </div>
  )
}
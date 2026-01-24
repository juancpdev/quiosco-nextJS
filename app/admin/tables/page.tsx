"use client";

import Heading from "@/components/ui/Heading";
import TableCanvas from "@/components/admin/table/TableCanvas";
import { formatCurrency } from "@/src/utils";
import { TableWithOrders } from "@/src/types";
import useSWR from "swr";

export default function TablesPage() {
  const { data: occupiedTables = [], isLoading: loadingOccupied } = useSWR<TableWithOrders[]>(
    '/api/admin/tables/occupied',
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 3000, revalidateOnFocus: false }
  );

  const { data: allTables = [], isLoading: loadingTables } = useSWR<TableWithOrders[]>(
    '/api/admin/tables/all',
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 3000, revalidateOnFocus: false }
  );

  const totalRevenue = occupiedTables.reduce((sum, table) => {
    return sum + table.orders.reduce((orderSum, order) => orderSum + order.total, 0)
  }, 0);

  if (loadingOccupied || loadingTables) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Heading>Gestión de Mesas</Heading>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Heading>Gestión de Mesas</Heading>

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
            {formatCurrency(totalRevenue)}
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